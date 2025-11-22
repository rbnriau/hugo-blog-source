---
title: "Preparación del entorno del servidor web"
date: 2025-06-25T15:57:47+01:00
draft: false
tags: ["Linux", "Debian", "SSH"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Instalación de Debia como servidor web y control de accesos con SSH"
canonicalURL: "https://blog.thebytepathchronicles.es/posts/cap01_preparación_entorno"
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



## Estructura del directorio del proyecto local


```plaintext
Servidor_Byte_Path/
├── articulos_html
├── articulos_md
│   ├── cap01_preparacion_entorno.md
│   ├── cap02_seguridad_basica.md
│   ├── cap03_servidor_web_apache.md
│   ├── cap04_contenido_web_estatico.md
│   ├── cap05_organizacion_y_multimedia.md
│   ├── cap06_automatizacion_basica.md
│   ├── cap07_seguridad_y_logs.md
│   ├── cap08_despliegue_en_la_nube.md
│   └── cap09_mantenimiento_y_respaldo.md
├── control
│   └── control_imagenes.ods
├── documentacion
│   ├── bitacora.md
│   └── emojis.md
├── herramientas
├── imagenes
│   ├── optimizadas
│   └── originales
│       └── bit-01.png
├── logs
└── portada
```




> **Nota:** 
En principio preparé esta estructura para organizarme mejor ya que se usan capturas de pantalla que hay que redimensionar y optimizar a webp, algunos scripts para automatizar algunas tareas y pensando en que segun aumentasen los articulos y archivos podría ser dificil encontrar muchas cosas. Esta estructura la usé al principio en mi entorno local, luego hice algunas pruebas en un servidor web Apache2 en Debian 12, instalados en un mini pc con bajos recursos con el que cuento en casa, así iba ensayando y probando el despliegue de la web en ese servidor. En este servidor ya no usé algunas carpetas, me centré en las que se utilizaban exclusivamente para la web. Más adelante me atreví con un servidor privado virtual en OVHCloud. En este punto había decidido optimizar el rendimiento de la web usando muy pocas imágenes, exclusivamente las portadas de cada capítulo, alguna miniatura y logo con lo que se simplificó aun más la estructura del directorio en /var/www/bytepath . Simplemente colgaban del directorio raiz los archivos html y css con una carpeta para imágenes de portadas (con sus dimensiones para diseño responsivo).

```plaintext
bytepath
│   ├── README.md
│   ├── apache2-seg.html
│   ├── apache2.html
│   ├── bitacora.html
│   ├── estilos.css
│   ├── imagenes
│   │   ├── portadas
│   │   │   ├── A1C0N00-background-1200px.webp
│   │   │   ├── A1C0N00-background-1800px.webp
............
│   │   │   ├── portada_index_800px.webp
│   │   │   └── redimensionar_portadas.sh
│   │   └── varios
│   │       ├── candado_verde.svg
│   │       ├── cuadrado_verde.svg
│   │       ├── escudo_azul.ico
│   │       └── escudo_azul.svg
│   ├── index.html
│   ├── instalacion_servidor.html
│   ├── intro.html
│   ├── proyecto.html
│   └── seguridad_basica.html
├── bytepath_chronicles_backup_20250618.tar.gz
├── bytepath_chronicles_backup_20250619.tar.gz
├── bytepath_chronicles_backup_20250621.tar.gz
├── crear_copia_seguridad.sh
......
```
> **Nota:** 
Cuento con un script para redimensionar y convertir las portadas y otro para realizar copias comprimidas manualmente.
Trabajar con SSHFS, montando este directorio en un directorio local y poder usar cualquier herramienta gráfica para editar archivos que están en un servidor web remoto sin entorno de escritorio me ha facilitado mucho el trabajo. En el momento de editar esta parte estoy descubriendo Github y seguramente termine adaptándome a otros flujos de trabajo más abiertos a colaboraciones y trabajo en equipo.

## Instalación de Debian 12  

Usaré un mini-PC para el entorno de pruebas, una vez todo funciones correctamente se migrará a una instancia virtual en la nube, GCP o AWS.

La instalación del sistema se realizó desde un USB, con Debian 12 sin entorno de escritorio. Una vez completada, lo primero fue poner el entorno en marcha:

- Actualización inicial del sistema.
```bash
root@1-bytepath:~# apt update
root@1-bytepath:~# apt upgrade
```
   


- Instalación de sudo y adición del usuario rubenrv al grupo de administradores:

```bash
root@1-bytepath:~# apt install sudo
root@1-bytepath:~# usermod -aG sudo rubenrv
```

- Tras reiniciar, verifiqué con id rubenrv que el cambio se aplicó correctamente.
```bash
root@1-bytepath:~# id rubenrv
uid=1000(rubenrv) gid=1000(rubenrv) grupos=1000(rubenrv),24(cdrom),25(floppy),27(sudo)...
```


- Luego instalé el servidor SSH (openssh-server) y comprobé que estuviera activo y funcionando.

```bash
rubenrv@1-bytepath:~$ sudo apt install ssh-server
rubenrv@1-bytepath:~$ sudo systemctl status ssh
ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; preset: enabled)
     Active: active (running) since Wed 2025-06-25 23:25:44 CEST; 14min ago
......
```

> Todo listo para administrar el sistema de forma remota.



## Usuario, hostname y red

**Hostname:** 1-bytepath 
**Usuario:** rubenrv 
**IP:** 192.168.8.150/24 
**Red Local** 192.168.8.0/24 


## Acceso remoto con SSH

Una vez verificado que el servicio SSH está activo y permite conexiones, es momento de reforzar la seguridad del sistema. Para ello, configuraremos el acceso únicamente mediante clave pública y desactivaremos el acceso por contraseña.

- Generar clave SSH (desde el cliente) 

 ```bash
 rubenrv@debian:~$ ssh-keygen -t ed25519 -C "rubenrv@bytepath"
 ```

> -t ed25519: indica que se usará el algoritmo de clave ed25519. 
> -C "rubenrv@bytepath": es un comentario opcional para ayudar a identificar la clave. 
> Este comando creará dos archivos, la clave privada que no se compartirá nunca y la pública que copiaremos en el servidor.

- Copiar la clave pública en el servidor 

```bash
rubenrv@debian:~$ ssh-copy-id rubenrv@192.168.8.150
```

Esto creará el archivo ~/.ssh/authorized_keys en el servidor (si no existe) y añadirá la clave pública. 

- Comprobar el acceso con la clave y sin pass.
     
```bash
rubenrv@debian:~$ ssh rubenrv@192.168.8.150
Linux 1-bytepath 6.1.0-37-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.140-1 (2025-05-22) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Jun 25 23:38:34 2025 from 192.168.8.149
rubenrv@1-bytepath:~$ 
```


- Eliminar acceso al servidor con contraseña. 

```bash
rubenrv@1-bytepath:~$ sudo nano /etc/ssh/sshd_config
```
```plaintext
# CONTENIDO DEL ARCHIVO /etc/ssh/sshd_config (solo las partes relevantes)

# [...] otras configuraciones [...]

# Authentication:
#LoginGraceTime 2m
#PermitRootLogin prohibit-password
#StrictModes yes
#MaxAuthTries 6
#MaxSessions 10

# To disable tunneled clear text passwords, change to no here!
PasswordAuthentication no  # <-- CAMBIAR DE 'yes' A 'no', O AÑADIR ESTA LÍNEA

#PermitEmptyPasswords no

# [...] más configuraciones [...]
```

Con esta configuración evitamos que se nadie pueda intentar conectarse con una pass. La única opción válida es usar el equipo qeu tenga la clave privada. 

Por último reiniciamos el servicio ssh y comprobamos el estado del servicio. 
```bash
rubenrv@1-bytepath:~$ sudo systemctl restart ssh
rubenrv@1-bytepath:~$ sudo systemctl status ssh
[sudo] contraseña para rubenrv: 
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; preset: enabled)
     Active: active (running) since Wed 2025-06-25 23:25:44 CEST; 32min ago
       Docs: man:sshd(8)
.....
```
> **Nota:** 
> En Debian y derivados, el servicio del servidor SSH se llama `ssh`. 
> Sin embargo, `sshd` también funciona como alias y ambos comandos reinician el servicio correctamente: 
 
```bash
rubenrv@1-bytepath:~$ sudo systemctl restart ssh
rubenrv@1-bytepath:~$ sudo systemctl restart sshd
```
 
> Esto puede variar en otras distribuciones, donde `sshd` suele ser el nombre más común del servicio.



## Paquetes básicos

Una vez completada la instalación de Debian 12 y configurado el usuario principal, se procede a instalar una serie de herramientas esenciales que facilitarán la administración del servidor y prepararán el entorno para tareas futuras. Algunas herramientas ya se han utilizado antes como **sudo** u **openssh-server**. 


### Actualización del sistema

```bash
rubenrv@1-bytepath:~$ sudo apt update && sudo apt upgrade -y
```

### Paquetes de administración

```bash
rubenrv@1-bytepath:~$ sudo apt install sudo net-tools curl wget htop bash-completion
```
> **sudo:** para otorgar permisos administrativos. 
> **net-tools:** utilidades como ifconfig. 
> **curl y wget:** herramientas para descargar archivos desde la terminal.
> **htop:** monitor interactivo de procesos. 
> **bash-completion:** autocompletado útil en terminal. 
> **lm-sensors:** útil para monitorear la salud del equipo. 
> **fancontrol:** permite controlar la velocidad de los ventiladores. 
> **strace:** rastrea las llamadas al sistema realizadas por un proceso. 



### Acceso remoto por SSH

```bash
rubenrv@1-bytepath:~$sudo apt install openssh-server
rubenrv@1-bytepath:~$sudo systemctl enable ssh
rubenrv@1-bytepath:~$sudo systemctl start ssh
rubenrv@1-bytepath:~$sudo systemctl status ssh  
```

### Servidor web Apache (instalación)

```bash
rubenrv@1-bytepath:~$sudo apt install apache2
```
La configuración del servidor web se tratará en el **Capitulo 03-Servidor Web Apache. 


## Cierre del capítulo

**Resumen rápido** 
- Instalación mínima de Debian 12 sin entorno gráfico. 
- Configuración de acceso remoto vía SSH con autenticación con clave. 
- Estructuración del entorno de trabajo y directorios del proyecto. 
- Instalación de herramientas administrativas básicas para monitorización y gestión del sistema. 


**Estado actual del entorno** 
El servidor local está operativo, accesible por SSH, con un entorno organizado y preparado para comenzar con la configuración de seguridad. 

**¿Y ahora qué?** 
En el próximo capítulo se abordarán las medidas básicas de protección como configurar cortafuegos.
  



