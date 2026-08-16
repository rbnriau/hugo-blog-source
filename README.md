# The Bytepath Chronicles Blog - Código Fuente Hugo

Blog técnico centrado en la administración de sistemas Linux, infraestructura, redes, seguridad, automatización y copias de seguridad/recuperación ante desastres (DR).

---

## Arquitectura y Despliegue

Este proyecto demuestra mis habilidades de Administración de Sistemas y Automatización:

1. **Tecnologías:** Hugo, Markdown, Linux (OS), Git/GitHub.
2. **Servidor:** Alojado en un Servidor Privado Virtual (VPS) en OVH.
3. **Proceso de Despliegue:**
   
   * La última versión del código se obtiene vía `git pull` al repositorio Git Hub.
   
   * GitHub Actions está configurado para actualizar cualquier cambio en el repositorio en la aplicacion Firebase, tanto el sitio web etático como el blog los cuales se migraron del VPS a Firebase.
