---
title: "LPIC-1 Tema 102 Instalación de Linux y gestión de paquetes"
date: 2025-12-05T11:30:03+00:00
description: "Segunda parte de lpic-101"
# weight: 1
# aliases: ["/first"]
tags: ["lpic-1", "linux"]
author: "Ruben Riau Vicente"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false

canonicalURL: "https://blog.thebytepathchronicles.es/posts/tema 102 instalacion de linux y gestion de paquetes/"

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

## 102.1 Diseño del esquema de particionado del disco

 **Objetivo**: Comprender como se organizan los discos y particiones en Linux y como esto afecta a la instalación. (Este tema ya se ha cubierto suficiente en el anterior tema)
 
## 102.2 Instalar un gestor de arranque

 **Objetivo** Conocer los gestores de arranque mas comunes y como se configuran.
 (También se ha tratado suficiente en el eanterior tema).
 
## 102.3 Gestión de librerías compartidas

 **Objetivo**: Entender como Linux gestiona librerías compartidas y cómo hacer que el sistema las encuentre.
	- **Librerías dinámicas vs estáticas**:
		- Estáticas: se copian la binario
		- Dinámicas: se cargan en tiempo de ejecución
	- **Comandos impotantes**:
		- `ldd <pograma>` --> lista librerías compartidas requeridas
		- `ldconfig` --> actualiza cache de librerías `/etc/ld.so.cache` 
	- **Rutas**:
		- `/lib`, `/usr/lib`, `/lib64`, `/usr/lib64` --> librerías estandard
		- `/etc/ld.so.conf` --> rutas adicionales
	- **Variables de entorno**
		- `LD_LIBRARY_PATH` --> añadir rutas temporales para librerías.
		
## 102.4 Gestión de paquetes Debian

 **Objetivo**: Manejar paquetes en sistemas basados en Debian (dpkg y apt)
 **Herramientas**
 	1 **dpkg**
 		- Instalar: `dpkg -i paquete.deb`
 		- Quitar: `dpkg -r paquete`
 		- Ver estado: `dpkg -l | grep paquete`
 		- Listar contenido: `dpkg -L paquete`
 	2 **APT(Advanced Package Tool)**
 		- Instalar:`apt install paquete`
 		- Actualizar índices: `apt update`
 		- Actualizar paquetes: `apt upgrade`
 		- Quitar: `apt remove paquete`/ `apr purge paquete`
 		- Buscar: `apt search paquete`
 		- Información: `apt show paquete`
 	3 **Repositorios**
 		- Configuración: `/etc/apt/sources.list`y `/etc/apt/sources.list.d/`
 		- Paquetes pueden ser *main*, *contrib*, *non-free*
## 102.5 Gestión de paquetes RPM y YUM
 **Objetivo**: Manejar paquetes en distribuciones basadas en Red Hat (RHEL, CentOS, Fedora)
 **Herramientas**:
 	1.**rpm**(bajo nivel)
 		- Instalar: `rpm -i paquete.rpm`
 		- Actualizar: `rpm -U paquete.rpm`
 		- Quitar: `rpm -e paquete`
 		- Ver: `rpm -q paquete`
 		- Listar archivos: `rpm -ql paquete`
 		- Comprobar integridad: `rpm -V paquete`
 	2.**yum/dnf**(alto nivel)
 		- Instalar: `yum install paquete`
 		- Actualizar: `yum update`
 		- Quitar: `yum remove paquete`
 		- Buscar: `yum search paquete`
 		- Mostrar info: `yum info paquete`
 	3.**Repositorios**
 		- Configuración: `/etc/yum.repos.d/*.repo`
## 102.6 Linux como sistema virtualizado
 **Objetivo**: Conocer las formas de virtualización y conceptos básicos para LPIC
 **Tipos**:
 	- Full virtualization/hypervisor
 	- Paravirtualization
 	- Containers
 	
 	
 	
 	
 
 		 
