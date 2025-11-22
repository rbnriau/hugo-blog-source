# The Bytepath Chronicles Blog - Código Fuente Hugo

Este repositorio contiene el código fuente completo (Markdown, configuración de Hugo y el tema PaperMod) para mi blog técnico.

---

## Arquitectura y Despliegue

Este proyecto demuestra mis habilidades de Administración de Sistemas y Automatización:

1.  **Tecnologías:** Hugo, Markdown, Linux (OS), Git/GitHub.
2.  **Servidor:** Alojado en un Servidor Privado Virtual (VPS) en OVH.
3.  **Proceso de Despliegue:**
    * La última versión del código se obtiene vía `git pull` en el VPS.
    * Un script de Bash (`deploy.sh`) en el servidor se encarga de compilar Hugo y sincronizar el sitio web estático.
