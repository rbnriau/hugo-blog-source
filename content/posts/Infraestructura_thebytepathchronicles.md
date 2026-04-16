---
title: "Infraestructura de TheBytePathchronicles"
date: 2026-04-16T15:57:47+01:00
draft: false
tags: ["Linux", "Tips", "git"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Descripción-mapa de la Infraestructura creada para la creación y mantenimiento de sitios web"
canonicalURL: "https://blog.thebytepathchronicles.es/posts/Infraestructura_thebytepathchronicles/"
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

## 🟡 REGISTRO DE DOMINIO
OVH
→ dominio comprado: thebytepathchronicles.es
                                   thebytepathchronicles.com


---

## 🛡️ DNS AUTORITATIVO
Cloudflare
→ gestión actual de DNS
→ redirecciones
→ capa de seguridad / proxy

---

## 🌍 DOMINIO PRINCIPAL (WEB)

www.thebytepathchronicles.es
→ Firebase Hosting
→ sitio principal (relato)

thebytepathchronicles.es
→ redirige a www (301)

---

## 📝 BLOG TÉCNICO

blog.thebytepathchronicles.es
→ Firebase Hosting (proyecto separado)
→ contenido independiente

---

## 🚀 CI/CD (DEPLOY)

GitHub
→ repositorios de proyectos

GitHub Actions
→ build + deploy automático a Firebase

---

## 🧪 ENTORNO LOCAL DE TRABAJO

Máquina local (desarrollo)
→ edición de sitios (Hugo / static / etc.)
→ preparación antes de push a GitHub

---

## 🖥️ INFRAESTRUCTURA LEGACY

VPS OVH (inactivo actualmente)
→ antiguo hosting / pruebas
→ actualmente no en producción

---

## 🛡️ EDGE / CDN

Cloudflare
→ cache global
→ protección DDoS
→ proxy inverso hacia Firebase

---

## 🧠 FUENTES DE VERDAD

- Código → GitHub
- Deploy → GitHub Actions + Firebase
- Producción → dominios en Cloudflare

## Hosting

- Firebase


  



