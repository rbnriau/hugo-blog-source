# Blog TheBytePathChronicles – Guía rápida

Este documento sirve como recordatorio del flujo de trabajo para crear y publicar contenido en el blog.

---

# Arquitectura del sistema

- Contenido: Markdown en este repositorio (Hugo)
- Generación del sitio: Hugo
- Deploy: GitHub Actions
- Hosting/CDN: Firebase Hosting
- Dominio: Cloudflare

---

#  Crear un nuevo post

## Opción recomendada (usar archetype)


hugo new posts/mi-nuevo-articulo.md

hugo server  (abrir en http://localhost:1313) para ver vista previa

git add .
git commit -m "nuevo post: X"
git push

Deploy automático con Github actions que despliega cambios en Firebase


Notas:
Si draft: true --> el post no se publica (por defecto en frontmatter esta en false)

No ejecutar hugo (se ejecuta en el deploy automático)

Revisar campos a editar en Frontmatter 


