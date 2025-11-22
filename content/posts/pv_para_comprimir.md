---
title: "Uso de pv para comprimir"
date: 2025-10-30T17:53:14+01:00
draft: false
tags: ["Linux", "tips", "Compresion"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Cuando se comprime un archivo muy grande es útil usar pv que nos muestra un seguimiento del proceso.."
canonicalURL: "https://blog.thebytepathchronicles.es/posts/ pv_para_comprimir"
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

# Uso de pv para comprimir

**Fecha:** 20-10-2025

---

## Descripción general

Cuando se comprime un archivo muy grande es útil usar pv que nos muestra un seguimiento del proceso.

---

## Comandos utilizados

```bash
sudo apt update
sudo apt install pv 
# Puede ser que ya esté instalado en el sistema
```

Al usar este comando junto con tar y la compresión la sintaxis cambia, ya no debemos poner la opción -f habitual porqeu vamos a redireccionar a pv de esta manera.

```
tar -cJ [fichero_origen] | pv > [fichero_destino.tar.xz]
```

Nos aparecerá el volumen comprimido, velocidad de compresión y una marca que se mueve que nos indica que no se ha quedado 'colgado' el proceso.

Algo así:

```
3,91GiB 0:30:03 [2,46 MiB/s] [   <=>                 ]   
```
