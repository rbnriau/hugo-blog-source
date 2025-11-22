---
title: "El comando scp"
date: 2025-10-24T17:53:14+01:00
draft: false
tags: ["Linux", "Bash", "Tips"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Transferencia segura de archivos con el comando scp"
canonicalURL: "https://blog.thebytepathchronicles.es/posts/comando_scp"
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

Útil para transferir archivos entre maquinas virtuales que no tienen carpeta compartida o portapapeles activado. 

---

## Comandos usados
```bash
ip a # Para conocer la ip de la máquina virtual receptora.
sudo scp # Transferencia segura
```
Averiguamos la ip de la maquina a la que queremos transferir los archivos:
```bash
$ ip a
1: lo:.....
  .........
2: enp1s0 .....
  ......
  ......
  inet clave_privada/24
  ....
```
Desde la máquina de la que queremos enviar los archivos ejecutamos:
```bash
$ sudo scp path_del_archivo_a_enviar usuario@ip_receptor:path_donde_guardar_el_archivo
```
Se nos pedirá la pass del usuario remoto.
Si es la primera vez nos aparecerá un mensaje que debemos aceptar:
```bash
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
# Introducimos la contraseña
htop-3.4.1-2.mga10.x86_64.rpm                 100%  173KB  45.5MB/s   00:00  
```
Desde la máquina receptora podemos comprobar que se ha recibido el archivo








