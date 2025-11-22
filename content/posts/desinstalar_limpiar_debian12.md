---
title: "Desinstalación de paquetes APT"
date: 2025-11-14T17:53:14+01:00
draft: false
tags: ["Linux", "Debian"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Desinstalación de paquetes apt y limpieza de repositorios que no se usan"
canonicalURL: "https://blog.thebytepathchronicles.es/posts/desinstalar_limpiar_debian12"
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



 
## Descripción rápida
 
Con el uso diario del sistema suelen instalarse paquetes que a la larga no se van a usar más o que solo fueron pruebas puntuales. Tener esos paquetes y sus repositorios especiales, si fue necesario añadirlos alarga el proceso del update, a veces, mostrando errores si fueron instalaciones fallidas.
En este apunte detallaré los pasos para eliminar algunos de estos paquetes y sus dependencias, además de los repositorios que se usaron para su instalación que no pertenecían al sistema debian por efecto.
  
---

## Comprobar repositorios existentes

En esta ocasión tengo claro algunos programas que quiero desinstalar: steam, lutris y wineHQ.
Steam lo tengo instalado como flatpak y usa proton para compatibilidad con juegos .exe , por tanto no necesito ni Steam (paquete apt), Lutris o nada relacionado con wine.
La versión Flatpak de Steam, no tiene ninguna relación con los paquetes apt, ya que se encuentra en su propio contenedor gestionado por Flatpak.

```bash
ls -l /etc/apt/sources.list.d/
-rw-r--r-- 1 root root 163 jul 24 09:10 azure-cli.sources
-rw-r--r-- 1 root root 153 jul 16 08:11 extrepo_librewolf.sources
-rw-r--r-- 1 root root 190 ago  1 22:19 google-chrome.list
-rw-r--r-- 1 root root 134 ago  1 23:06 lutris.list
-rw-r--r-- 1 root root 138 jun 15  2023 microsoft-prod.list
-rw-r--r-- 1 root root 296 abr 24  2025 steam-beta.list
-rw-r--r-- 1 root root 228 abr 24  2025 steam-stable.list
-rw-r--r-- 1 root root 278 oct 17 15:32 vscode.sources
-rw-r--r-- 1 root root 166 jun  4 23:23 winehq-bookworm.sources
-rw-r--r-- 1 root root 163 jun 30 12:08 zabbix.list
-rw-r--r-- 1 root root 179 jun 30 12:08 zabbix-release.list
-rw-r--r-- 1 root root 179 jun 30 12:08 zabbix-tools.list
-rw-r--r-- 1 root root 173 jun 30 12:08 zabbix-unstable.list
```
Comprobamos que no hemos agregado ninguna linea con repositorios extras en /etc/apt/sources.list

```bash
sudo nano /etc/apt/sources.list
#deb cdrom:[Debian GNU/Linux 12.5.0 _Bookworm_ - Official amd64 NETINST with firmware 20240210-11:27]/ bookworm contrib main non-free-firmware

deb http://deb.debian.org/debian/ bookworm main non-free-firmware
deb-src http://deb.debian.org/debian/ bookworm main non-free-firmware

deb http://security.debian.org/debian-security bookworm-security main non-free-firmware
deb-src http://security.debian.org/debian-security bookworm-security main non-free-firmware

# bookworm-updates, to get updates before a point release is made;
# see https://www.debian.org/doc/manuals/debian-reference/ch02.en.html#_updates_and_backports
deb http://deb.debian.org/debian/ bookworm-updates main non-free-firmware
deb-src http://deb.debian.org/debian/ bookworm-updates main non-free-firmware

# This system was installed using small removable media
# (e.g. netinst, live or single CD). The matching "deb cdrom"
# entries were disabled at the end of the installation process.
# For information about how to configure apt package sources,
# see the sources.list(5) manual.
```
## Eliminar paquetes

Ya hemos comprobado los repositorios que no vamos a necesitar tras desinstalar los paquetes que no necesito.
Voy a usar dpkg para encontrar todos los paquetes relacionados con los programas a desinstalar.

-**wineHQ**

```bash
dpkg -l | grep -i wine
ii  fonts-wine                              8.0~repack-4                        all          Windows API implementation - fonts
ii  libwine:amd64                           8.0~repack-4                        amd64        Windows API implementation - library
ii  wine-stable                             10.0.0.0~bookworm-1                 amd64        WINE Is Not An Emulator - runs MS Windows programs
ii  wine-stable-amd64                       10.0.0.0~bookworm-1                 amd64        WINE Is Not An Emulator - runs MS Windows programs
ii  wine-stable-i386:i386                   10.0.0.0~bookworm-1                 i386         WINE Is Not An Emulator - runs MS Windows programs
ii  winehq-stable                           10.0.0.0~bookworm-1                 amd64        WINE Is Not An Emulator - runs MS Windows programs
```
Y ahora desinstalo cada uno de los paquetes
```bash
sudo apt purge winehq-stable wine-stable wine-stable-amd64 wine-stable-i386 libwine fonts-wine
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
Los paquetes indicados a continuación se instalaron de forma automática y ya no son necesarios.
  gstreamer1.0-plugins-base:i386 i965-va-driver:i386 intel-media-va-driver:i386 libabsl20220623:i386 libaom3:i386 libasound2:i386
....
....
 linux-headers-6.1.0-39-amd64 linux-headers-6.1.0-39-common linux-image-6.1.0-39-amd64 mesa-va-drivers:i386 mesa-vdpau-drivers:i386
  ocl-icd-libopencl1:i386 sane-airscan:i386 va-driver-all:i386 vdpau-driver-all:i386
Utilice «sudo apt autoremove» para eliminarlos.
Los siguientes paquetes se ELIMINARÁN:
  fonts-wine* libwine* wine-stable* wine-stable-amd64* wine-stable-i386:i386* winehq-stable*
0 actualizados, 0 nuevos se instalarán, 6 para eliminar y 0 no actualizados.
Se liberarán 2.185 MB después de esta operación.
¿Desea continuar? [S/n] S
(Leyendo la base de datos ... 285733 ficheros o directorios instalados actualmente.)
Desinstalando fonts-wine (8.0~repack-4) ...
...
...
sudo apt autoremove
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
Los siguientes paquetes se ELIMINARÁN:
  gstreamer1.0-plugins-base:i386 i965-va-driver:i386 intel-media-va-driver:i386 libabsl20220623:i386 libaom3:i386 libasound2:i386
...
...
0 actualizados, 0 nuevos se instalarán, 184 para eliminar y 0 no actualizados.
Se liberarán 758 MB después de esta operación.
¿Desea continuar? [S/n] S
(Leyendo la base de datos ... 281930 ficheros o directorios instalados actualmente.)
Desinstalando gstreamer1.0-plugins-base:i386 (1.22.0-3+deb12u5) ...
...
...
```
Opcionalmente podemos limpiar un prefijo que instala wine en nuestro home

```bash
rm -rf ~/.wine
```
-**Lutris**

Los mismos pasos para Lutris.

```bash
dpkg -l | grep -i lutris
ii  lutris           0.5.18                     all          video game preservation platform
```
Localizado el paquete a desinstalar lo purgamos
```bash
sudo apt purge lutris
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
Los paquetes indicados a continuación se instalaron de forma automática y ya no son necesarios.
 python3-protobuf python3-setproctitle python3-yaml qsynth qt6-gtk-platformtheme qt6-qpa-plugins qt6-translations-l10n vulkan-tools
Utilice «sudo apt autoremove» para eliminarlos.
Los siguientes paquetes se ELIMINARÁN:
  lutris*
0 actualizados, 0 nuevos se instalarán, 1 para eliminar y 0 no actualizados.
Se liberarán 4.882 kB después de esta operación.
¿Desea continuar? [S/n] S
(Leyendo la base de datos ... 259029 ficheros o directorios instalados actualmente.)
Desinstalando lutris (0.5.18) ...
Procesando disparadores para hicolor-icon-theme (0.17-2) ...
...
...
```
```bash
sudo apt autoremove
Se liberarán 52,9 MB después de esta operación.
¿Desea continuar? [S/n] S
(Leyendo la base de datos ... 258656 ficheros o directorios instalados actualmente.)
Desinstalando cabextract (1.9-3) ...
...
...
```
También podemos limpiar la configuración local de Lutris
```bash
rm -rf ~/.config/lutris
rm -rf ~/.local/share/lutris
```
-**Steam(APT)**
```bash
dpkg -l | grep -i steam
rc  steam-launcher                          1:1.0.0.83                          amd64        Launcher for the Steam software distribution service
```
```bash
sudo apt purge steam-launcher              
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... 50%
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
Los siguientes paquetes se ELIMINARÁN:
  steam-launcher*
0 actualizados, 0 nuevos se instalarán, 1 para eliminar y 0 no actualizados.
Se utilizarán 0 B de espacio de disco adicional después de esta operación.
(Leyendo la base de datos ... 257940 ficheros o directorios instalados actualmente.)
Purgando ficheros de configuración de steam-launcher (1:1.0.0.83) ...
dpkg: atención: al desinstalar steam-launcher, el directorio «/usr/lib/steam/steam_launcher» no está vacío, por lo que no se borra
```
```bash
sudo apt autoremove
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
0 actualizados, 0 nuevos se instalarán, 0 para eliminar y 0 no actualizados.
```
Steam creó algunos directorios que ya no necesitamos

```bash
ls -l /usr/lib/steam/steam_launcher
total 4
drwxr-xr-x 2 root root 4096 ago  6 18:31 __pycache__
```
```bash
sudo rm -rf /usr/lib/steam/
```
## Limpiar los repositorios

```bash
sudo rm /etc/apt/sources.list.d/winehq-bookworm.sources
sudo rm /etc/apt/sources.list.d/lutris.list
sudo rm /etc/apt/sources.list.d/steam-beta.list
sudo rm /etc/apt/sources.list.d/steam-stable.list
```
Ahora podemos actualizar los repositorios.
```bash
sudo apt update
```















 
 
 

