---
title: "LPIC-1(101) Arranque del sistema"
date: 2025-11-25T11:30:03+00:00
description: "Mapa mental tema 101.2"
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

canonicalURL: "https://blog.thebytepathchronicles.es/posts/lpic1_101.2_arranque_del_sistema/"

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
![Mapa mental Arranque del sistema](/img/LPIC-1/tema_101.2_arranque_del_sistema.webp)


El proceso **POST**, se ejecta en primer lugar identificando fallos simples en dispositivos, dando paso a **BIOS o UEFI**.

## BIOS

Activa los componentes básicos para cargar el sistema y carga la primera etapa del gestor de arranque que se encuentra en el **MBR**(pequeña partición al inicio del disco).

La primera etapa llama a la segunda etapa del gestor de arranque y carga el núcleo del sistema operativo.

## UEFI

Difiere del **BIOS** en que puede identificar particiones y leer muchos sistemas de archivos.
La partición **UEFI**,(** ESP**) puede contener diferentes aplicaciones, entre ellas el gestor de arranque.
Tras el **POST**, **UEFI** lee las definiciones en **NVRAM** y ejecuta la aplicación **EFI** predefinida, si es el gestor de arranque, cargará el núcleo del sistema operativo.

## GRUB

Es el cargador de arranque al que se llama desde **BIOS o UEFI**, desde el menú de **GRUB** se puede elegir qué núcleo debe cargarse y pasarle parámetros como:
- **acpi**: scpi=off deshabilita compatibilidad con ACPI.
- **init**: establece iniciador de sistema alternativo.. init=/bin/bash establece shell.
- **systemd.unit** Establece a systemd... systemd.unit=graphical.target
- **maxcpus** Limita el número de procesadores.
- **quiet** Oculta la mayoría de mensajes de arranque.
- **vga** Selecciona modo de video.
- **root** Establece la partición raíz.. root=/dev/sda3
 - **ro** Sistema de archivos raíz de solo lectura.
 - **rw** Permite escribir en el sistema de archivos raíz durante el montaje inicial.
 
## Inicialización del sistema

Cuando el gestor de arranque carga el núcleo en la **RAM**, el núcleo se hará cargo de la **CPU**, abrirá el *initramfs*  que contiene un sistema de archivos raiz temporal para proporcionar los módulos necesarios para que el núcleo pueda acceder al sistema de archivos raíz real.

El núcleo montará todos los sistemas de archivos configurados en **/etc/fstab** y luego ejecutará el programa **init**:

- **SysV** Administrador de servicios basado en  en SysVinit, sustituido en la actualidad por systemd.
- **systemd** Administrador de sistemas y servicios compatible con SysV.
- **Upstart** Utilizado adurante un tiempo por **Ubuntu**, en desuso en la actualidad.

## Inspección de inicialización

La información recopilada durante el proceso de arranque se guarda en un espacio en memoria llamado *kernel ring buffer* y pueden mostrarse con el comando* dmesg*.

```
$ dmesg
[5.262389] EXT4-fs (sda1): mounted filesystem with ordered data mode. Opts: (null)
[5.449712] ip_tables: (C) 2000-2006 Netfilter Core Team
...
...
```
En sistemas modernos basados en system puede usarse el comando *journalctl* 
```
journalctl --list-boots    # muestra una lista de números de arranque relativos al arranque actual
-4 9e5b3eb4952845208b841ad4dbefa1a6 Thu 2019-10-03 13:39:23 -03—Thu 2019-10-03 13:40:30 -03
-3 9e3d79955535430aa43baa17758f40fa Thu 2019-10-03 13:41:15 -03—Thu 2019-10-03 14:56:19 -03
```
```
journalctl -b 0            # muestra los mensajes del arranque actual
journalctl -b -1           # muestra los mensajes del arranque anterior
```
  **/var/log/** es la ruta donde se almacenan los mensajes emitidos por el sistema opeativo así como la inicialización.
Pueden usarse las opciones -D o --directory para buscar mensajes de journal que no estén en **/var/log/journal**














