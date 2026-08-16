---
title: "Hardening de Servidores Linux: Implementación de UFW y IPS con Fail2ban en Debian 12"
date: 2025-06-25T15:57:47+01:00
draft: false
tags: ["Linux", "Debian", "Apache", "Hardening"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Configuración de SSH y Fail2ban"
canonicalURL: "https://blog.thebytepathchronicles.es/posts/cap02_seguridad_basica"
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
#cover:
#    image: "" # image path/url
#    alt: "" # alt text
#    caption: "" # display caption under cover
#    relative: false
#    hidden: true
#editPost:
#    URL: ""
#    Text: "Suggest Changes"
#    appendFilePath: true
---

## Introducción a la Seguridad en Servidores Web

 Cuando se trata de configurar un servidor web, la seguridad es uno de los aspectos más importantes a considerar. Un servidor web expuesto a internet puede ser vulnerable a diversos tipos de ataques, como intrusiones, denegación de servicio, robo de información, entre otros. Por lo tanto, es crucial implementar medidas de seguridad sólidas desde el inicio para proteger nuestra infraestructura y los datos que aloja.

1. **Actualización del sistema operativo y software:** Fundamental para corregir vulnerabilidades conocidas y evitar que sean explotadas por atacantes.

2. **Confguración segura del servidor web:** Ajustar permisos de archivos, puertos abiertos y módulos habilitados puede ayudar a reducir la superficie de ataque.

3. **Gestión de cuentas y permisos:** Establecer políticas de contraseñas seguras, limitar el acceso a cuentas privilegiadas y otorgar permisos mínimos a los usuarios para prevenir accesos no autorizados.

4. **Monitorización y registro de actividad:** Configurar un sistema de registro eficaz y monitorizar regularmente los registros puede ayudarnos a detectar y responder a posibles incidentes de seguridad.

5. **Uso de herramientas de seguridad:** Firewalls, IDS y herramientas  de escaneo de vulnerabilidades pueden complementar nuestra seguridad.
   
   En este capítulo, nos enfocaremos en la instalación y configuración de UFW(Uncomplicated Firewall) que nos ayudará a establecer reglas de seguridad básica para el servidor web.

## UFW

![Logo de UFW](/img/cap02_seguridad_basica/A1C2N000-ufw.webp)

### Instalación de UFW

Actualizamos el sistema e instalamos ufw.
![Instalación UFW](/img/cap02_seguridad_basica/A1C2N01.webp)

Habilitamos UFW
![Habilitar UFW](/img/cap02_seguridad_basica/A1C2N02.webp)
Tal como nos advierte la salilda del comando, corremos el riesgo de que el firewall deniegue nuestra actual conexión ssh, lo que nos dejaría sin posibilidad de acceder remotamene al equipo.
Antes de habilitar UFW debemos asegurarnos de que el puerto 22 esté abierto.
![Puertos](/img/cap02_seguridad_basica/A1C2N03.webp)
Y ahora si, lo habilitamos.
![Habilitar ufw](/img/cap02_seguridad_basica/A1C2N04.webp)
Y podemos comprobar que el puerto 22 está escuchando mi conexión.
![Netstat](/img/cap02_seguridad_basica/A1C2N05.webp)

### Reglas mínimas

Es el momento de configura unas reglas mínimas. Permitiré el acceso remoto ssh, que ya configuramos para que solo permita conectarse con mi clave privada,  permitiremos el 80 para HTTP y 443 para HTTPS.
![reglas ufw](/img/cap02_seguridad_basica/A1C2N06.webp)
También necesito el sevicio SFTP para transmitir archivos pero usa el mismo puerto de SSH.
Con netstat podemos ver los puertos abiertos actualmente.
![netstat](/img/cap02_seguridad_basica/A1C2N07.webp)

### Verificación del estado

Estado general de firewall
![status](/img/cap02_seguridad_basica/A1C2N08.webp)
Reglas específicas
![reglas añadidas](/img/cap02_seguridad_basica/A1C2N09.webp)

## Fail2ban

### Introducción a Fail2ban

Fail2ban es una herramienta que actúa como sistema de detección y prevención de intrusiones protegiendo nuestro servidor  contra:

1. Ataques de fuerza bruta contra SSH.
2. Scans maliciosos.
3. Intentos de explotación de vulnerabilidades.

### Instalación básica

![Instalación de Fail2ban](/img/cap02_seguridad_basica/A1C2N10.webp)
![Activación de Fail2ban](/img/cap02_seguridad_basica/A1C2N11.webp)

### Configuración personalizada

Este paso es importante hacerlo para que cuando se actualice Fail2ban no se sobreescriba nuestra configuración. Creando el fichero jail.local, fail2ban tendrá preferencia por esta configuración en lugar de jail.conf

- Tuve problemas porque no tuve en cuenta que Debian 12 no guarda los log de ssh como espera fail2ban que sería en /var/log/auth.log sino que Debian usa systemd-journald como sistema de logs por defecto. Esto provocaba errores y hay que configurarlo especialmente tal como mostraré en las siguientes secciones.

![Crear nuevo archivo jail.local](/img/cap02_seguridad_basica/A1C2N12.webp)
Aquí lo personalizamos para SSH, podemos crear nuevas Jails para otros servicios como apache2.

### Habilitar y arrancar el servicio

![Habilitar Fail2ban](/img/cap02_seguridad_basica/A1C2N13.webp)

### Verificar que la jail sshd está activa

![jail activas](/img/cap02_seguridad_basica/A1C2N14.webp)

![ estado jail sshd](/img/cap02_seguridad_basica/A1C2N15.webp)

### Protección para Apache

Si nuestro servidor web tiene un sitio público, Apache está constantemente recibiendo tráfico como:

1. Bots maliciosos.
2. Scanners automáticos.
3. Fuerza bruta contra formularios de login.
4. Exploits conocidos contra rutas como /phpmyadmin, /wp-login.php, etc.

Aunque de momento estamos en una red local, voy a ir preparándome para estar listo en el momento de migrar a internet.

Crearé tres jails para apache en mi archivo jail.local.

1. 🔹 apache-auth
   
    -  Detecta múltiples errores de autenticación HTTP.
   
    -  Protege paneles admin protegidos por .htaccess, por ejemplo.

2. 🔹 apache-noscript
   
    -  Detecta intentos de acceder a scripts no permitidos (común en ataques automáticos).

3. 🔹 apache-badbots
   
    -  Detecta bots que usan User-Agents sospechosos conocidos por comportamiento malicioso.

![Crear jails Apache](/img/cap02_seguridad_basica/A1C2N16.webp)
![Estado Fail2ban](/img/cap02_seguridad_basica/A1C2N17.webp)

### Monitorización y gestión

1. Monitoreo básico de UFW
   ![Puertos abiertos](/img/cap02_seguridad_basica/A1C2N18.webp)
2. Monitoreo básico de Fail2ban
   ![Jail activas](/img/cap02_seguridad_basica/A1C2N19.webp)

### Pruebas de funcionamiento

Tengo una  maquina virtual Kali que usaré para intentar loguearme repetidas veces hasta que Fail2ban la bloquee. Con esto comprobaremos que no pueden hacer intentos indefinidos de logeo a mi servidor.

![intento de acceso SSH](/img/cap02_seguridad_basica/A1C2N20.webp)

![logs intentos de acceso y baneo](/img/cap02_seguridad_basica/A1C2N21.webp)

Sobre la protección a Apache2, de momento no voy a hacer más pruebas porque siendo una web estática sin formularios y logins, no tiene sentido probar protecciones a esas características.
 Sin embargo habría que añadir alguna configuración más a la seguridad básica.

1. **Eliminar o sustituir página por defecto de Apache**
   
   ![Cambiar página por defecto de apache](/img/cap02_seguridad_basica/A1C2N22.webp)

2. **Configurar Apache para que no muestre info de su versión**
   
   ![Configuración apache](/img/cap02_seguridad_basica/A1C2N23.webp)

3. **Habilitar esta configuración**
   
   ```bash
   sudo a2enconf security.conf
   ```

## Notas para producción

Cuando migre el servidor web a la nube debería cambiar el puerto 22 por defecto para ssh por otro.
Debo recordar que GCP tiene su propio firewal(finalmente acabé contratando con OVHCloud un Servidor Privado Virtual), deberé informarme a fondo de esto pues podría bloquearme sin querer.
En entornos Cloud añadir mi IP pública a **ignoreip** y configurar optimizaciones.
De momento no he configurado Apache para generar tráfico cifrado HTTPS

## Cierre del capítulo

**Resumen rápido**

- Implementamos UFW como cortafuegos básico para el servidor.
- Configuramos reglas mínimas de seguridad (SSH, HTTP, HTTPS).
- Verificamos el estado del firewall y puertos abiertos.
- Aprendimos sobre consideraciones clave para entornos de producción.
- Instalamos y configuramos Fail2ban y comprobamos su funcionamiento.

**Estado actual del entorno**
El servidor ahora tiene:

- Firewall básico activado (UFW) con puertos esenciales abiertos.
- Fail2ban instalado y configurado.
- SSH configurado solo con autenticación por clave pública.
- Servicios web (HTTP/HTTPS) accesibles pero protegidos.

**¿Y ahora qué?**
En el próximo capítulo nos enfocaremos en la configuración de apache2.
