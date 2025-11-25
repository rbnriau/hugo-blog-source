---
title: "Tema 101 Arquitectura del Sistema"
date: 2025-11-25T11:30:03+00:00
description: "Mapa mental tema 101"
# weight: 1
# aliases: ["/first"]
tags: ["lpci", "linux"]
author: "Ruben Riau Vicente"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false

canonicalURL: "https://blog.thebytepathchronicles.es/posts/lpic1_101_arquitectura_del_sistema/"

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


![Tema 101 Arquitectura del Sistema](/img/LPIC-1/Tema_101_Arquitectura_del_Sistema.webp)

## 1.Activar y desactivar dispositivos

**BIOS/UEFI**
- Habilitar y deshabilitar periféricos integrados.
- Activar protecciones básicas contra errores.
- Cambiar configuraciones de hardware.
- Ver información del sistema.

Comandos útiles:
```
sudo dmidecode -t bios # Información específica de la BIOS
sudo dmidecode -t system # Información general del sistema
```
## 2.Inspección de dispositivos en Linux
**lspci-Dispositivos PCI**
Comandos más comunes:
```
lspci -s 04:02.o -v
lspci -s 01:00.0 -k      # Ver módulos del kernel asociados
```
Esta información también puede encontrarse en:
```
/sys/bus/pci/devices/
```
**lsusb-Dispositivos USB**
```
lsusb
lsusb -v -d 1781:0c9f
lsusb -t
lsusb -s 01:20
```
**lsmod-Listar módulos del kernel**
```
lsmod
```
**modprobe-Cargar o descargar módulos del kernel**
```
modprobe -r snd-hda-intel
```
**modinfo-Información sobre módulos**
```
modinfo -p nouveau
```
## 3. Archivos de información y archivos de dispositivos
**/proc- Información del kernel y del sistema**
```
/proc/interrupts  # Lista de interrupciones por CPU
/proc/ioports     # Puertos de entrada/salida registrados
/proc/dma         # Canales DMA en uso
/proc/cpuinfo     # Datos detallados sobre el procesador
/proc/meminfo     # Información de memoria
/proc/partitions  # Particiones detectadas
```
**sys-Información del kernel y del hardware**
sistema de archivos que expone la relación entre dispositivos, módulos y buses.
**udev- Gestor de dispositivos dinámico**
- Crea dispositivos en /dev
- Asigna reglas persistentes
- Gestiona eventos del kernel(hotplug)
**dbus-Comunicación entre procesos**
- Protocolo para que servicios y aplicaciones intercambien mensajes.
- Usado por sistemas de escritorio, NetworkManager,systemd...
## 4.Dispositivos de almacenamiento.
**/dev-Archivos de dispositivo**
-Discos SATA/SCSI:
```
/dev/sda, /dev/sdb..
```
- Discos NVME:
```
/dev/nvme0n1
/dev/nvme0n1p1
```

