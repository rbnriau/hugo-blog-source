---
title: "Flujo de trabajo local-github"
date: 2025-10-20T15:57:47+01:00
draft: false
tags: ["Linux", "Git"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Resumen de mi flujo de trabajo entre mi repositorio local y github"
canonicalURL: "https://blog.thebytepathchronicles.es/posts/flujo-local-github"
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

## Inicio

- Para verificar que todo está listo antes de empezar a trabajar
```bash
 ssh -T git@github.com
 Hi [usuario]! You've succesfully authenticated...
```
- Antes de usar los comandos git debe añadirse la clave SSH al agente (una vez por sesion).
```bash
ssh-add ~/.ssh/[id de la clave privada]
```
- Si la clave tiene contraseña, deberá introducirse aqui una sola vez.
- Crear y guardar el archivo en el directorio original del proyecto en local.
- Para sincronizar con GitHub:
```bash
 git add .
 git commit -m "Mensaje descriptivo de los cambios realizados"
 git push origin main
``` 

 ---
 

```
 ---
 Gracias a la autenticación SSH todo funciona sin pedir usuario/contraseña.
 
## Ventajas de la configuración actual.
 
 - **Seguridad** : Uso de claves SSH en lugar de contraseñas.
 - **Comodidad** : Gnome gestiona el agente SSH, solo se debe añadir la clave al agente al iniciar sesion en la terminal
 - **Sin conflictos con VSCode** : VSCode usa su propio sistema de autenticación con GitHub en caso de necesitar usarlo. Si quiero usar la terminal con comandos git y editores sencillos, la terminal tiene su propia autenticación.
 
 ---
 
## Ejemplo de uso
```bash
 ssh-add ~/.ssh/[id dela clave] # Una vez por sessión
 cd [path al directorio local del repositorio]
 nano nueva-nota.md # Crear o editar archivos
 # Sincronizar con GitHub
 git add .
 git commit -m "Comentario"
 git push origin main
``` 

 
