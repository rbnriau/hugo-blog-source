---
title: "Hardening y logs en Apache2"
date: 2025-06-25T15:57:47+01:00
draft: true
tags: ["Linux", "Debian", "Apache2", "Hardening", "Logs"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "En este artículo reforzamos la seguridad en apache2 y empezamos a monitorear los logs"
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

# 🧯 Capítulo 07 – Seguridad y Logs

Este capítulo es fundamental para la administración de cualquier servidor. Un buen conocimiento y práctica en la revisión de logs es la primera línea de defensa para la detección temprana de problemas, ataques o irregularidades. No solo nos ayuda a depurar, sino que también nos proporciona información vital sobre el comportamiento de nuestro sistema y aplicaciones.

## 📦 Logwatch

Logwatch es una herramienta muy útil para la monitorización automatizada y resumida de los logs del sistema. En lugar de tener que revisar manualmente cada archivo de log (Apache, SSH, sistema, etc.), Logwatch los recopila, analiza y nos envía un resumen diario (o con la frecuencia que configuremos) por correo electrónico. Esto nos permite tener una visión rápida y eficiente de lo que está sucediendo en nuestro servidor.

**Porqué usar Logwatch?**
- **Eficiencia:** Recibe un resumen conciso en lugar de leer logs voluminosos.
- **Detección Temprana:** Ayuda a identificar patrones inusuales o actividades sospechosas que podrían indicar un problema de seguridad o un fallo del sistema.
- **Centralización:** Agrupa información de múltiples logs (Apache, SSH, kernel, etc.) en un solo informe.

El envío de correos al administrador por parte de Logwatch implica tener instalado SSL/TLS. Como ya decidí hacer este paso una vez esté en la nube, pospongo la instalación y configuración de Logwatch para más adelante.

## 🔎 journalctl y dmesg

Estas dos herramientas son fundamentales para la inspección de logs del sistema a un nivel más bajo, específicamente relacionados con systemd (el gestor de sistemas y servicios en Debian) y el kernel de Linux. Son vitales para diagnosticar problemas del sistema o de bajo nivel que no necesariamente aparecen en los logs de aplicaciones.

### journalctl
 permite consultar y gestionar los logs que systemd recoge. Estos logs son binarios y se almacenan en el journal, lo que los hace más eficientes y permite filtrar de maneras muy potentes.

**Comandos útiles de journalctl:**


1. Ver todos los logs del sistema.
- ```bashjournalctl```
2. Ver los logs en tiempo real.
- ```bashjournalctl -f```
3.- Ver logs de un servicio específico (ej. Apache):
- ```bashjournalctl -u apache2.service</pre></code>
- ```bashjournalctl -u apache2.service -f # En tiempo real```
4. Filtrar por tiempo:
- ```bashjournalctl --since "2025-06-01 10:00:00" --until "2025-06-01 10:30:00"```
- ```bashjournalctl --since "yesterday"```
- ```bashjournalctl --since "1 hour ago"```
5. Ver mensajes de error y advertencias.
- ```bashjournalctl -p err```
- ```bashjournalctl -p warning```
### dmesg (diagnose message)
 Es una herramienta para imprimir o controlar el buffer de mensajes del kernel. Estos mensajes se generan durante el arranque del sistema y por los controladores de hardware mientras el sistema está en funcionamiento. Son cruciales para diagnosticar problemas de hardware, controladores, memoria o errores de bajo nivel del sistema.

**Comandos útiles de dmesg**
1. Ver todos los mensajes del kernel
-  ```bashdmesg```
2. Ver los últimos mensajes del kernel
- ```bashdmesg | tail```
3. Filtrar mensajes del kernel
- ```bashdmesg | grep -i error```
- ```bashdmesg | grep -i "fail"```
- ```bashdmesg | grep -i "memory"```
- 📌 La opción -i hace que la búsqueda no distinga entre mayúsculas y minúsculas.
4. Borrar el buffer de dmesg (requiere sudo):
- ```bashsudo dmesg -c```

## 📝 Revisión básica de logs

Esta sección es más conceptual y de "buenas prácticas". Aunque hemos visto herramientas específicas, es importante saber dónde buscar y qué buscar.
### Directorios de logs comunes
1. ```bash/var/log/syslog```
- Logs generales del sistema.
2. ```bash/var/log/auth.log```
- Logs relacionados con la autenticación.
3. ```bash/var/log/apache2/```
- Contiene los logs de Apache
4. ```bash/var/log/apt/history.log```
- Registra las instalaciones, actualizaciones y eliminaciones de paquetes APT. Útil para saber qué se ha cambiado en el sistema.
5. ```bash/var/log/faillog```
-  Registra los intentos fallidos de inicio de sesión.
6. ```bash/var/log/mail.log```

### Monitoreo Básico de Recursos 
**Comandos de monitoreo básico de CPU, RAM y disco**
- Uso de CPU y RAM:
  - ```bashhtop y top```
- Uso de RAM:
  - ```bashfree -h```
- Uso de espacio en disco:
  - ```bashdf -h```
  
### Consejos para la revisión de logs

- **Revisión Regular:** Habituarse a revisar los logs de forma regular, al menos una vez al día para un servidor en producción.
- **Patrones de Comportamiento:** Aprender a reconocer el "ruido" normal de los logs y a identificar patrones inusuales.
- **Errores Recientes:** Después de hacer cambios en la configuración o implementar nuevas características, revisar el error.log de Apache y journalctl -u mi_servicio para detectar cualquier problema inmediatamente.
- **Correlación de Logs:** Si se detecta un problema en un log (ej. un error de Apache), intentar correlacionarlo con otros logs (ej. syslog o auth.log) para obtener una imagen completa de lo que sucedió.
- **Automatización:** Además de Logwatch, considerar usar herramientas más avanzadas en el futuro como ELK Stack (Elasticsearch, Logstash, Kibana) o Grafana Loki para centralización y visualización de logs a gran escala.

## ✅ Cierre del capítulo

📌 **Resumen rápido**  
  - **Logwatch:** Introdujimos Logwatch como una herramienta para la monitorización automatizada y resumida de logs, entendiendo su propósito para la detección temprana de problemas y seguridad, posponiendo su configuración para la nube.
  - **Herramientas de Logs de Sistema:** Nos familiarizamos con journalctl para la consulta de logs de systemd y dmesg para los mensajes del kernel, esenciales para el diagnóstico a bajo nivel.
  - **Revisión Básica de Logs:** Cubrimos las ubicaciones clave de los logs en /var/log/ y practicamos herramientas esenciales de línea de comandos como tail, less y grep para la inspección directa de archivos.
  - 

🔧 **Estado actual del entorno**  
Nuestro servidor Apache2 en Debian 12 ahora no solo está configurado para servir nuestro blog de forma segura y eficiente, sino que también tenemos las herramientas y el conocimiento básico para monitorear su salud y actividad. Podemos revisar logs de sistema, detectar posibles anomalías y observar el consumo de recursos directamente desde la línea de comandos.

🚀 **¿Y ahora qué?**  
Con una comprensión sólida del monitoreo básico, ¡es hora de dar el gran salto! En el próximo capítulo, nos centraremos en la migración de nuestro blog a Google Cloud Platform (GCP). Una vez allí, configuraremos el crucial HTTPS con Let's Encrypt, instalaremos y activaremos Logwatch para recibir resúmenes diarios por correo, y finalmente, daremos forma a la portada de nuestro sitio web y los capítulos que documentan toda esta aventura.

💬 **Bitácora del viajero**  
> *"Los logs son la voz de tu servidor; aprender a escucharlos es el primer paso para dominar su funcionamiento y asegurar su silencio ante las amenazas."*
