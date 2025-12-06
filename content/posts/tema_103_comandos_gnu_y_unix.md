---
title: "LPIC-1 Tema 103 Comandos Gnu y Unix"
date: 2025-12-06T11:30:03+00:00
description: "tercera parte de lpic-101"
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

canonicalURL: "https://blog.thebytepathchronicles.es/posts/tema 103 comandos gnu y unix/"

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
## 103.1 Trabajar en la línea de comandos
### Navegación y básicos
- `pwd` Muestra ruta actual
- `cd`Cambia de directorio
- `ls`, `ls -l`, `ls -a`, `ls -lh`  Lista contenido
- `file <archivo>` Identifica tipo de archivo
- `type`, `whitch`, `command -V` Muestra información sobre comandos
### Ayuda
- `man`, `man -k`, `man section commando`
- `info`
- `help`

## 103.2 Procesar texto con filtros
### Visualización
- `cat`, `tac`
- `nl` Numerar líneas
- `less`, `more`
- `head`, `tail`, `tail -f`
### Selección y manipulación
- `cut -d -f`
- `sort`, `sort -n`, `sort -r`
- `uniq`, `uniq -c`, `uniq -d`
- `tr`, `tr A-Z a-z`, `tr -d`
- `wc`, `wc -l`, `wc -w`
### Búsqueda
- `grep`, `grep -i`, `grep -r`, `grep -E`
- `sed 's/old/new/'`
- `awk '{print $1}`

## 103.3 Gestión básica de archivos
- `cp`, `cp -r`, `cp -a`
- `mv`
- `rm`, `rm -r`, `rm -f`
- `mkdir`, `mkdir -p`
- `rmdir`
- `touch`
- `ln`, `ln -s`

## 103.4 Usar streams, pipelines y redirecciones
### Redirecciones
- `>` Sobreescribe
- `>>` Añade
- `<` Entrada desde archivo
- `<<EOF` Here-doc
- `<<EOF "texto"` Here-string
### Pipelines
- `comando1 | comando2`
### Stderr
- `2> error.log`
- `2>&1` Unir stdout y stderr

## 103.5 Crear, monitorizar y eliminar procesos
- `ps`, `ps aux`, `ps -ef`
- `top`, `htop`
- `jobs`
- `bg`, `fg`
- `kill`, `kill -9`, `killall`
- `nice`, `renice`
- `watch comando`

## 103.6 Modificar prioridades de los procesos
- `nice -n 10 coamndo` Iniciar con prioridad
- `renice -n +5 -p PID` Cambia prioridad existente

## 103.7 Buscar archivos
- `find /path -name "*.txt"`
- `find -type f`, `-type d`
- `find -mtime`, `-size`, `-user`
- `find -exec comando {} \;`
- `locate`, `updatedb`

## 103.8 Manipulación básica de archivos
- `file`
- `gzip`, `gunzip`
- `bzip2`, `bunzip2`
- `xz`, `unxz`
- `tar -cvf`, `tar -xvf`, `tar -tvf`
- `dd if=... of=... bs=...`
- `split`, `csplit`
- `strings`

## 103.9 Usar editores de texto básicos
### nano
...
### vi/vim - mínimos obligatorios
- Entrar en modo edición `i`
- Guardar `:w`
- Salir `:q`
- Forzar `:qw!`
- Buscar `/texto`
- Reemplazar línea `:s/viejo/nuevo/`
- Navegación `h j k l`






