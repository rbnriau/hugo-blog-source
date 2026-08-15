---
title: "Sincronización Segura Plesk-NAS: Arquitectura Staging con Verificación Criptográfica y Resiliencia Operativa"
date: 2026-08-15T17:53:14+01:00
draft: false
tags: ["Bash, Hardening, Linux,seguridad, SSH"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: ""
canonicalURL: ""
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
    image: "" # image path/url
    alt: "" # alt text
    caption: "" # display caption under cover
    relative: false
    hidden: true
editPost:
    URL: ""
    Text: "Suggest Changes"
    appendFilePath: true
---

# Sincronización Segura Plesk-NAS: Arquitectura Staging con Verificación Criptográfica y Resiliencia Operativa

**Fecha:** 2026-08-15  
**Tema:** backup's

---

## Descripción rápida

Sincronización Segura Plesk-NAS: Arquitectura Staging con Verificación Criptográfica y Resiliencia Operativa

## 1. Introducción

Este documento detalla el diseño, implementación y validación de un sistema automatizado de sincronización de backups entre un servidor web gestionado con **Plesk** y un **NAS local**. El sistema garantiza una copia de seguridad externa siguiendo la estrategia **3-2-1** (3 copias, 2 soportes, 1 desconectada), con redundancia adicional mediante **snapshots periódicos** en el NAS y réplicas en discos externos.

**Ventajas clave del diseño:**

- **Soberanía tecnológica:** Eliminación de dependencias de software de terceros.
- **Portabilidad:** Compatibilidad con sistemas Unix/Linux.
- **Seguridad:** Uso de rsync sobre SSH, autenticación por claves y principio de mínimo privilegio.
- **Robustez:** Mecanismos de detección de colisiones, control de espacio y autocuración.
- **Eficiencia:** Transferencia diferencial de datos y optimización de recursos.

## 2. Contexto y Justificación

### 2.1. Escenario Actual

- **Infraestructura:**
  - Entorno multiservidor gestionado con Plesk para alojar dominios de clientes.
  - Dos dispositivos QNAP en local: uno para backups de Plesk y otro para recursos internos.
  - Copias periódicas en discos duros externos.
- **Protocolo anterior:** Sincronización mediante FTP en modo pasivo con tareas programadas.
- **Limitaciones detectadas:**
  - Gestión manual del espacio en disco.
  - Riesgo de saturación del servidor.
  - Falta de snapshots para recuperación granular.

### 2.2. Problemas y Necesidades

| Problema               | Necesidad                              |
| ---------------------- | -------------------------------------- |
| Uso de FTP (inseguro)  | Cifrado en tránsito (SSH)              |
| Gestión manual espacio | Automatización con políticas retención |
| Sin snapshots          | Recuperación granular de archivos      |
| Riesgo de saturación   | Control proactivo del almacenamiento   |

### 2.3. Objetivos Técnicos

1. **Cifrado y seguridad en el transporte:** Reemplazar FTP por rsync sobre SSH.
2. **Eficiencia en la transferencia:** Uso de delta transfer para minimizar ancho de banda.
3. **Gestión inteligente del almacenamiento:** Políticas de retención automática en Plesk.
4. **Inmutabilidad y recuperación granular:** Snapshots periódicos en el NAS.
5. **Principio de mínimo privilegio:** Usuario dedicado (`rsyncuser`) con permisos restringidos.

## 3. Arquitectura de la Solución

```mermaid
graph LR
    A[Backups Plesk: /var/lib/psa/dumps/] -->|Script staging.sh| B[Copia intermedia: /home/rsyncuser/staging/]
    B -->|rsync sobre SSH| C[NAS: /mnt/work/backups/]
    C -->|Snapshots| D[Recuperación granular]
    C -->|Verificación integridad| B
```

## 4. Flujo Lógico de Sincronización

El proceso se divide en **tres fases automatizadas**:

1. **Preparación (Servidor Plesk)**:- El script `staging.sh` detecta nuevos backups en `/var/lib/psa/dumps/`.- Crea una réplica en `/home/rsyncuser/staging/`.- **Objetivo**: Aislar los datos sensibles del sistema.
2. **Extracción (NAS)**:- El script `rsync.sh` en el NAS inicia una transferencia **pull** mediante `rsync`.- **Ventaja**: No requiere abrir puertos adicionales en el NAS.
3. **Verificación y Cierre**:- El NAS compara los hashes (SHA-256) de los archivos en origen y destino.- Si coinciden, envía una orden para borrar el contenido de `/home/rsyncuser/staging/`.- **Objetivo**: Liberar espacio en el servidor Plesk.

---

## 5. Detalles de Implementación

### 5.1. Configuración del Usuario `rsyncuser`

- **Creación del usuario**:
  
  ```bash
  useradd -m -d /home/rsyncuser -s /bin/bash rsyncuser
  ```

- **Permisos**:
  
  - Acceso restringido a `/home/rsyncuser/`.
  - Shell `/bin/bash` para ejecutar scripts auxiliares.

- **Autenticación SSH**:
  
  - Claves pública/privada para acceso seguro (detalles en [Apéndice 11.2]).

---

### 5.2. Script de Plesk (`/root/staging.sh`)

**Funcionalidades clave**: Variables centralizadas, filtro de silencio, lock con trap, quiescencia, fusible de espacio (<20%), rsync optimizado (-rt --delete) y contador de colisiones persistentes.

```bash
#!/bin/bash
DUMPS="/var/lib/psa/dumps"
STAGING="/home/rsyncuser/staging"
LOCK="/tmp/post_backup.lock"
STATE_FILE="/tmp/dumps_last_check"
LOG="/var/log/post_backup.log"
BUSY_FILE="$STAGING/.busy"
ADMIN_EMAIL="admin@empresa.com"

# Filtro de silencio
LAST_MOD=$(find "$DUMPS" -type f -printf '%T@\n' 2>/dev/null | sort -n | tail -1)
if [ -z "$LAST_MOD" ] || [ "$(printf "%.0f" "$LAST_MOD")" -le "$(cat "$STATE_FILE" 2>/dev/null || echo 0)" ]; then
    exit 0
fi

# Lock seguro con trap
if [ -f "$LOCK" ]; then echo "$(date) - Otra instancia en ejecución." >> "$LOG"; exit 0; fi
touch "$LOCK"
trap 'rm -f "$LOCK"' EXIT

# Quiescencia
if find "$DUMPS" -type f -mmin -5 | grep -q .; then
    echo "$(date) - Plesk escribiendo. Postergado." >> "$LOG"; exit 0
fi

# Fusible espacio <20%
REQUERIDO=$(du -s "$DUMPS" 2>/dev/null | awk '{print $1}')
DISPONIBLE=$(df "$STAGING" 2>/dev/null | awk 'NR==2 {print $4}')
TOTAL_DISCO=$(df "$STAGING" 2>/dev/null | awk 'NR==2 {print $2}')
UMBRAL=$(( TOTAL_DISCO * 20 / 100 ))
if [ "$(( DISPONIBLE - REQUERIDO ))" -lt "$UMBRAL" ]; then
    MSG="ALERTA CRÍTICA: Espacio insuficiente en $(hostname)."
    echo "$(date) - $MSG" >> "$LOG"
    mail -s "ALERTA: Espacio en Disco" "$ADMIN_EMAIL" <<< "$MSG"
    rm -f "$BUSY_FILE"; exit 1
fi

# Rsync + permisos staging
touch "$BUSY_FILE"
rsync -rt --delete --stats "$DUMPS/" "$STAGING/" >> "$LOG" 2>&1 || { 
    mail -s "Fallo rsync" "$ADMIN_EMAIL" <<< "Error en staging"; rm -f "$BUSY_FILE"; exit 1; 
}
chown -R rsyncuser:rsyncuser "$STAGING" && chmod -R 770 "$STAGING"

# Doble check colisión + contador persistente
CURRENT_MOD=$(find "$DUMPS" -type f -printf '%T@\n' 2>/dev/null | sort -n | tail -1)
if [ "$(printf "%.0f" "$CURRENT_MOD")" -gt "$(printf "%.0f" "$LAST_MOD")" ]; then
    echo "$(date) - Colisión detectada. .busy mantenido." >> "$LOG"
    COUNT=$(cat /tmp/backup_fallos_count 2>/dev/null || echo 0)
    echo $((COUNT + 1)) > /tmp/backup_fallos_count
    [ $((COUNT + 1)) -eq 12 ] && mail -s "Bloqueo persistente" "$ADMIN_EMAIL" <<< "3h bloqueado"
else
    rm -f /tmp/backup_fallos_count "$BUSY_FILE"
    printf "%.0f" "$CURRENT_MOD" > "$STATE_FILE"
    echo "$(date) - Completado exitosamente." >> "$LOG"
fi
```

### 5.3. Script del NAS (`/root/rsync.sh`)

**Funcionalidades clave**: Espera activa (.busy), SSH hardened (BatchMode=yes, ConnectTimeout=10), rsync compatible SMB, verificación SHA-256 cruzada y limpieza remota condicional.

```bash
#!/bin/bash
STAGING_REMOTE="/home/rsyncuser/staging/"
REMOTE_USER="rsyncuser"
REMOTE_HOST="100.124.53.48"
SSH_KEY="/root/.ssh/id_nas_to_plesk"
LOCAL_DIR="/mnt/work/backups/"
LOG="/var/log/rsync_from_plesk.log"
SSH_CMD="ssh -i $SSH_KEY -o BatchMode=yes -o ConnectTimeout=10"

# Esperar staging libre
while $SSH_CMD "$REMOTE_USER@$REMOTE_HOST" "[ -f ${STAGING_REMOTE}.busy ]" 2>/dev/null; do
    echo "$(date) - Staging ocupado. Esperando..." >> "$LOG"; sleep 60
done

# Transferencia
rsync -rtz --stats --no-p --no-g --no-o --delete --inplace \
    -e "$SSH_CMD" "$REMOTE_USER@$REMOTE_HOST:$STAGING_REMOTE/" "$LOCAL_DIR" >> "$LOG" 2>&1 || {
    echo "$(date) - ERROR: Fallo rsync." >> "$LOG"; exit 1
}

# Verificación SHA-256 + limpieza
$SSH_CMD "$REMOTE_USER@$REMOTE_HOST" "cd $STAGING_REMOTE && find . -type f ! -name '.busy' -exec sha256sum {} +" | sort > /tmp/remote_checksums 2>/dev/null
find "$LOCAL_DIR" -type f ! -name '.busy' -exec sha256sum {} + | sort > /tmp/local_checksums 2>/dev/null

if diff -q /tmp/remote_checksums /tmp/local_checksums >/dev/null 2>&1; then
    $SSH_CMD "$REMOTE_USER@$REMOTE_HOST" "rm -rf ${STAGING_REMOTE}/*" >> "$LOG" 2>&1
    echo "$(date) - Integridad verificada. Staging limpio." >> "$LOG"
else
    echo "$(date) - ADVERTENCIA: Checksums no coinciden. Staging NO limpiado." >> "$LOG"
    exit 1
fi
rm -f /tmp/remote_checksums /tmp/local_checksums
```

## 6. Robustez y Gestión de Escenarios Críticos

### 6.1. Control de Colisiones

- **Quiescencia**: Detecta si Plesk está escribiendo backups (`find "$DUMPS" -type f -mmin -5`).
- **Doble check post-copia**: Compara timestamps antes y después de la sincronización.
- **Bloqueo persistente**: Mantiene el archivo `.busy` si hay colisiones.

### 6.2. Estrategia de Autoprotección

- **Fusible de almacenamiento**: Aborta si el espacio libre es < 20%.
- **Notificaciones proactivas**: Alertas por correo para colisiones persistentes o espacio crítico.

### 6.3. Sincronización con NAS por Bloqueo Permanente

- El NAS espera a que se elimine el archivo `.busy` antes de iniciar la transferencia.
- **Ventaja**: Evita copiar backups incompletos o corruptos.

---

## 7. Pruebas de Actividad y Validación de Robustez

Se realizaron pruebas para validar la robustez del sistema:

| **Prueba**                      | **Resultado**                                                           |
| ------------------------------- | ----------------------------------------------------------------------- |
| **Salto del fusible**           | El script abortó al detectar espacio insuficiente.                      |
| **Verificación de quiescencia** | El script pospuso la ejecución al detectar actividad reciente en Plesk. |
| **Simulación de colisión**      | Detectó cambios durante la copia y mantuvo el `.busy` para reintentar.  |

---

## 8. Optimización del Rendimiento

- **Filtro de silencio**: Evita ejecuciones innecesarias.
- **Sincronización diferencial**: `rsync -rt` para transferir solo cambios.
- **Uso eficiente de recursos**: Minimiza consumo de CPU y ancho de banda.

---

## 9. Mantenimiento

- **Reinicio manual**: Eliminar archivos `.lock` o `.busy` en casos excepcionales.
- **Snapshots en NAS**: Permiten recuperación granular de backups históricos.

---

## 10. Evolución Técnica: Mejoras Identificadas para Producción

> **Nota:** Esta sección documenta mejoras identificadas tras la implementación en entorno FCT. No forman parte del código desplegado originalmente, pero reflejan el análisis posterior para escalabilidad y endurecimiento en entornos CPD productivos.

| Área                       | Estado en FCT (v2.1)                | Mejora Recomendada para Producción                              | Justificación Técnica                                                                                 |
|:-------------------------- |:----------------------------------- |:--------------------------------------------------------------- |:----------------------------------------------------------------------------------------------------- |
| **Persistencia de Estado** | Lock y state en `/tmp` (volátil)    | Migrar a `/run/post_backup.lock` y `/var/lib/post_backup/state` | Evita pérdida de estado en reinicios y previene ataques symlink en directorios compartidos.           |
| **Notificaciones**         | `php mail()` (dependiente de Plesk) | Estandarizar con `msmtp`/`mailx` o webhooks (Slack/Teams)       | Desacopla alertas del stack PHP; garantiza entrega en servidores sin Plesk o en migraciones cloud.    |
| **Parametrización SSH**    | Ruta de clave fija en variable      | Externalizar a `.env` o vault (HashiCorp/Ansible)               | Permite reutilizar scripts en flotas multi-servidor sin modificar lógica ni exponer rutas en código.  |
| **Gestión de Logs**        | Crecimiento lineal sin rotación     | Configurar `logrotate` (rotación semanal + compresión)          | Previene saturación de inodos y cumple políticas de retención de logs en CPDs regulados.              |
| **Restricción de Shell**   | `rsyncuser` con bash completo       | Evaluar `rrsync` o shell restringida (`rbash`)                  | Reduce superficie de ataque si se compromete la clave SSH; limita operaciones exclusivamente a rsync. |

### 11.1. Comparativa de Seguridad y Robustez

| **Criterio**                   | **Solución Personalizada**                 | **Herramientas Nativas (QNAP/TrueNAS)**  |
| ------------------------------ | ------------------------------------------ | ---------------------------------------- |
| **Privilegios**                | Usuario restringido (`rsyncuser`)          | Requiere `root` o administrador          |
| **Verificación de integridad** | Hashes SHA-256 y doble check               | Sin verificación post-copia              |
| **Portabilidad**               | Basada en estándares Unix                  | Dependencia del fabricante               |
| **Automatización**             | Scripts personalizados con lógica avanzada | Tareas programadas sin control de estado |

### 11.2. Configuración SSH y Claves Pública/Privada

```bash
#Generación en NAS

ssh-keygen -t rsa -b 4096 -f /root/.ssh/id_nas_to_plesk -N ""

#Autorización en Plesk
cat /root/.ssh/id_nas_to_plesk.pub >> /home/rsyncuser/.ssh/authorized_keys

#Permisos críticos
chmod 600 /root/.ssh/id_nas_to_plesk*
chmod 700 /home/rsyncuser/.ssh
```
