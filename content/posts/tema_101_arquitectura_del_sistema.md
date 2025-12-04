---
title: "LPIC-1 Tema 101 Arquitectura del sistema"
date: 2025-12-04T11:30:03+00:00
description: "Primera parte de lpic-101"
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

canonicalURL: "https://blog.thebytepathchronicles.es/posts/tema 101 arquitectura del sistema/"

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

## 101.1 Determinar y configurar los ajustes del hardware
![Arquitectura del Sistema](/img/LPIC-1/Tema_101_Arquitectura_del_Sistema.webp)

- **Comandos básicos**:
 - `lspci` --> Lista dispositivos P?CI.
	 - `-v` detallado, `-k` drivers usados y disponibles.
 - `lsusb` --> Lista dispositivos USB.
 - `lsmod` --> Muestra módulos del kernel cargados. !! Lee de `/proc/modules`
 - `modinfo <mod>` --> Información del módulo.
 - `modprobe <mod>` -->Carga un módulo y sus dependencias.
 - `modprobe -r <mod>` --> Descarga un módulo.
 - `insmod <archivo.ko>` --> Carga módulo sin dependencias.
 - `rmod <mod>`--> Descarga módulo sin resolver dependencias.

- **Archivos del sistema**
 - `/proc` --> info dinámica del kernel
   - `/proc/cpuinfo`, `/proc/meminfo`, `/proc/interrupts`, `/proc/modules`, `/proc/ioports`, `/proc/scsi/`.
 -`/sys`--> sysinfo, info y control en tiempo real sobre dispositivos.
 
- **Control de módulos persistente**
	- `/etc/modprobe.d/*.conf`
	- `blacklist modulox` --> evita que cargue. En lugar de elilminar un módulo lo bloqueamos.
	- `options modulox key=value` configura opciones
	
- **dmesg**
	- `dmesg` --> mensajes del kernel
	- `dmesg | grep usb`
	
## 101.2 Arranque del sistema

![Mapa mental Arranque del sistema](/img/LPIC-1/tema_101.2_arranque_del_sistema.webp)

- Etapas del arranque
	- 1 BIOS/UEFI
		- Inicialilza hardware
		- Busca dispositivo de arranque
		- Carga MBR/EFI
	- 2 MBR (BIOS)
		- 512 bytes
		- Contiene tabla de particiones + bootloader stage 1
		- Limite: solo 4 particiones primarias
	- 3 UEFI
		- Usa la EFI System Partition(ESP)
		- Ruta típica en linux : `/boot/efi/EFI/<distro>/grubx64.efi`
	- 4 Bootloader/GRUB2)
		- Carga kernel + initrd
		- Presenta menú
	- 5 Kernel
		- Lanza rootfs
		- Lanza `init` (systemd)
- **Archivos importantes de GRUB2**
	- Configuración principal generado:
		- BIOS: `/boot/grub/grub.cfg`
		- UEFI: `/boot/efi/EFI/<distro>/grub.cfg`
	- Archivo donde se editan opciones:
		-`/etc/default/grub`
	- Scripts usados al generar menu:
		- `/etc/grub.d/`
	- Regenerar menú:
		```
		grub-mkconfig -o /boot/grub2/grub.cg  # también update-grub en debian y derivadas
		grub2-mkconfig -o /boot/grub2/grub.cfg # RHEL y derivadas
		```
- **Opciones del kernel**

	- En `/etc/default/grub`:
		- `GRUB_CMDLINE_LINUX`--> Opciones siempre para linux.
		- `GRUB_CMDLINE_LINUX_DEFAULT`Opciones solo para arranque normal.
	
- **initrd/initrmfs**
	- Contiene módulos necesarios para montar el sistema raiz.
		- `update-initramfs -u` en Debian
		
## 101.3 Cambiar niveles de ejecución/systemd targets
![Mapa mental Niveles de ejecución](/img/LPIC-1/tema_101.3_Niveles_de_ejecución.webp)

- Runlevels tradicionales (SysV)
	- 0 --> Halt
	- 1 --> Single-user
	- 2 --> Multi-user (sin red)
	- 3 --> Multi-user (con red)
	- 5 --> Multi-user + GUI
	- 6 --> Reboot
- systemd targets equivalentes
	- runlevel 1 --> rescue.target
	- runlevel 3 --> multi-user.target
	- runlevel 5 --> graphical.target
	- emergency.target --> mas restringido que rescue.
	
- Comandos systemd esenciales
	- Ver target actual `systemctl get-default`
	- Cambiar target permanente `systemctl set-default`
	- Cambiar target para sesión `systemctlk isolate`
	- Ver equivalencias `systemctl list-units --type=target`

- Acceso a modo de rescate desde GRUB
En el menú pulsar **e** y modificar la linea del kernel añadiendo:
	- `single` o `systemd.unit=rescue.target` o `systemd.unit=emergency.target`
	
	



