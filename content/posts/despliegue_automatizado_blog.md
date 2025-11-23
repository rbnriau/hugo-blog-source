---
title: "Despliegue automatizado del blog"
date: 2025-11-23T11:30:03+00:00
description: "Cambios en el flujo de trabajo en el despliegue del sitio web del blog"
# weight: 1
# aliases: ["/first"]
tags: ["git", "debian", "seguridad", "linux"]
author: "Ruben Riau Vicente"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false

canonicalURL: "https://blog.thebytepathchronicles.es/posts/despliegue_automatizado_blog"

disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: false
UseHugoToc: true
#cover:
#    image: "<image path/url>" # image path/url
#    alt: "<alt text>" # alt text
#    caption: "<text>" # display caption under cover
#    relative: false # when using page bundles set this to true
#    hidden: true # only hide on current single page
#editPost:
#    URL: "https://github.com/<path_to_repo>/content"
#    Text: "Suggest Changes" # edit text
#    appendFilePath: true # to append file path to Edit link
---

# Despliegue Automatizado de Blog Hugo

## 1. Introducción: Centralización y Flujo de Despliegue

He decidido centralizar mis notas y artículos técnicos en un blog alojado en mi **VPS de OVHCloud**. Para agilizar la publicación de mis notas en **Markdown**, elegí el **compilador estático Hugo por su agilidad**.

Mi curiosidad por la forma en que se realizan los despliegues profesionales me llevó a migrar de un flujo de trabajo manual (basado en `rsync` desde mi PC) a un **flujo automatizado "Push-to-Deploy"**. En este documento recopilaré las decisiones de arquitectura que he tomado, así como la resolución de errores.

                                                                                                                                                                                                                         

## 2. Comparación de Flujos de Despliegue

El **nuevo flujo de trabajo** utiliza **GitHub como la única Fuente de Verdad** para el código fuente y el **VPS como el Punto de Control de Despliegue**, invirtiendo la lógica del proceso anterior.

| **Característica**      | **Flujo Antiguo (Manual)**                                        | **Flujo Nuevo (Automatizado)**                                                                                                    |
|---------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Punto de Control**    | **PC Local** (Requiere ejecutar `hugo` y `rsync`).                    | **Servidor VPS** (Requiere solo un *push* + ejecución del script).                                                                  |
| **Gestión de Permisos** | **Sin problemas de permisos** durante la copia inicial con `rsync`. | La corrección de permisos y otros *fixes* están **integrados en el script** como medida de robustez y control total en el servidor. |
| **Evolución**           | Flujo de desarrollo personal.                                 | **Arquitectura SysOps:** Listo para la automatización con Webhooks.                                                               |

## 3. Flujo de Trabajo Final "Push-to-Deploy"

La idea es que, después de editar o crear un nuevo documento y subir los cambios (`git push`) a GitHub, se ejecute el script en el VPS. Esto asegura que la compilación (build) y los ajustes de permisos se realicen en el propio entorno de producción.

1. **Actualización:** Ejecutar `git pull origin main` para sincronizar el código fuente.
2. **Compilación:** Ejecutar `hugo` con la configuración y el tema asignados.
3. **Despliegue Atómico:** Ejecutar `rsync` para actualizar el sitio web (`/var/www/blog_hugo`), manteniendo el sitio en un estado consistente.
4. **Robustez:** Aplicar **permisos (**`chown`**/**`chmod`**)** para garantizar el **Principio de Mínimo Privilegio** y que Apache pueda leer el contenido sin riesgo.

## 4. El Script: `deploy.sh`

```
#!/bin/bash

# --- SCRIPT DE DESPLIEGUE AUTOMATIZADO ---
# Creado para el proyecto Hugo/VPS/Git

# 1. Variables de entorno
REPO_ROOT="/opt/hugo-source/hugo-blog-source" # Ruta del directorio desde donde arranca el script
WEB_ROOT="/var/www/blog_hugo" # Ruta del sitio web
HUGO_BIN="/usr/local/bin/hugo" # el path donde se instaló hugo

# 2. Navega al directorio del repositorio
cd "$REPO_ROOT"

# 3. Pull: Obtiene la última versión del código fuente desde GitHub
echo "Paso 1: Obteniendo la última versión del código desde GitHub..."
git pull origin main 
if [ $? -ne 0 ]; then
    echo "ERROR: Falló el git pull. Verifique la conexión SSH y el Deploy Key."
    exit 1
fi

# 4. Build: Compila el sitio con Hugo (genera la carpeta 'public')
echo "Paso 2: Compilando el sitio con Hugo..."
"$HUGO_BIN" --config hugo.yaml --buildDrafts
if [ $? -ne 0 ]; then
    echo "ERROR: Falló la compilación de Hugo. Revise el código fuente."
    exit 1
fi

# 5. Deploy: Sincroniza los archivos compilados con la carpeta de producción
# El comando 'rsync -avz --delete' borra todo lo que no esté en la carpeta 'public/'
echo "Paso 3: Sincronizando los archivos a la carpeta de producción ($WEB_ROOT)..."

rsync -avz --delete public/ "$WEB_ROOT"
# 5b. ¡FIX DE PERMISOS! Asigna el propietario y grupo al servidor web para garantizar lectura.
echo "Paso 3b: Aplicando permisos de servidor web..."
sudo chown -R debian:www-data "$WEB_ROOT"
# Aseguramos que el grupo (www-data) pueda leer y atravesar directorios.
sudo chmod -R g+rX "$WEB_ROOT"
echo "Despliegue completado con éxito."

```

## 5. Más Automatización: Evolución a Webhooks

El plan de automatización se orienta a un verdadero flujo de **Integración Continua (CI)**.

El script `deploy.sh` actualmente se ejecuta de forma manual, pero el siguiente paso es la migración a un activador basado en **Webhooks**. Esto permitirá a **GitHub** avisar al servidor VPS **inmediatamente** después de un `git push`, logrando un despliegue en tiempo real y eliminando la necesidad de tareas programadas (`cron`).

## 6. Relación de Problemas Resueltos

| **#**  | **Problema Detectado**            | **Causa Raíz**                                                                                     | **Solución Implementada**                                                                                         | **Lección Clave**                                                                     |
|----|-------------------------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| **1.** | **Paquetes Sugeridos (27GB)**     | `apt install hugo` intentó descargar dependencias innecesarias (`Recommends`).                     | **Descarga e instalación manual** del binario de Hugo (`.tar.gz`) en `/usr/local/bin/`.                               | Evitar dependencias excesivas de los *package managers*.                            |
| **2.** | **Riesgo de Clave SSH del VPS**   | Preocupación por usar la clave SSH personal para autenticación de Git.                         | Uso de una **Deploy Key de Solo Lectura** registrada solo en el repositorio de GitHub.                            | Aplicación del **Principio del Menor Privilegio** para acceso de máquina a máquina.   |
| **3.** | **Fallo de Robustez del Script**  | El script dependía de su ubicación (path relativo) para ejecutarse correctamente.              | Uso de **Rutas Absolutas Fijas** (`REPO_ROOT="/opt/..."`) para garantizar la portabilidad.                          | Diseñar scripts para que sean **autónomos** y robustos.                               |
| **4.** | **Error de Compilación (Layout)** | Hugo no encontraba el tema ni los *layouts*.                                                     | Se forzó la lectura de la configuración (`--config hugo.yaml`) y se detectó el problema de la carpeta del tema. | **Diagnóstico de Configuración** y **Sensibilidad a Dependencias**.                       |
| **5.** | **Fallo del Tema en el** `git pull` | La carpeta `themes/PaperMod` estaba vacía porque fue marcada como un **Submódulo Huérfano** por Git. | **Eliminación del** `.git` **interno** en el entorno local y se forzó el `git add/commit/push` completo.                  | Dominio de la **gestión de submódulos** y la limpieza de referencias internas de Git. |
