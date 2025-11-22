---
title: "Ollama en Manjaro"
date: 2025-06-30T17:53:14+01:00
draft: false
tags: ["Linux", "Manjaro", "LLM", "Debian"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Tras  el intento fallido del articulo anterior, lo intentamos con Manjaro "
canonicalURL: "https://blog.thebytepathchronicles.es/posts/ollama_vs_code_manjaro_persistente"
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

# Ollama en Manjaro Persistente y VS Code (con GPU AMD)

Tras los dos intentos previos (Debian 12 sin éxito, y Manjaro en Live USB con errores de espacio), se abordó una tercera estrategia: instalar **Manjaro XFCE de forma persistente en un pendrive de 32 GB**, utilizándolo como un disco duro real para ejecutar modelos LLM con **aceleración GPU** en local.

---

### Instalación de Manjaro en el Pendrive (Modo Persistente)

La clave para obtener persistencia real no era simplemente flashear la ISO, sino realizar una instalación completa del sistema en el pendrive:

1. Se flasheó la **ISO de Manjaro XFCE** en un **segundo pendrive** para crear un Live USB de instalación.
2. Se arrancó el PC desde ese Live USB e inició el instalador **Calamares**.
3. Se seleccionó cuidadosamente el **pendrive de 32 GB como disco de destino**, exactamente como se haría con un disco interno.

**Resultado:** Un entorno Manjaro funcional y persistente, con acceso total al almacenamiento, drivers modernos y todos los recursos del sistema, eliminando así las limitaciones del modo Live.

---

### Ollama con Aceleración GPU

Ya con Manjaro persistente corriendo, se instalaron los paquetes necesarios:

- `curl`, `lm_sensors`, `radeontop`
- Ollama (`curl -fsSL https://ollama.com/install.sh | sh`)

Al ejecutar `ollama run phi3:mini`, se detectó por fin el **stack ROCm activo**, habilitando el uso de la **Radeon RX Vega 56** como motor de inferencia. Herramientas como `radeontop` y el comportamiento de los ventiladores confirmaron que la GPU se estaba usando efectivamente.

**Status:** ¡Éxito! Ollama funcionando con aceleración GPU AMD en entorno local.

---

### Integración en VS Code: Chat con LLM en local

Con el modelo funcionando en terminal, el siguiente objetivo fué integrarlo en el entorno de desarrollo:

1. **Primer intento fallido**: La extensión "CodeGPT" estaba orientada a servicios en la nube y requería autenticación en Google/GitHub.
2. **Solución adecuada**: Se identificó e instaló la extensión **"Continue"**, compatible con servidores Ollama locales.

Una vez instalada, la extensión detectó el modelo local (`llama3`) y pidió confirmación para usarlo. No fue necesario descargar nada más, y el chat se habilitó correctamente dentro de VS Code.

**Resultado final:** Chat de Llama 3 operativo en el lateral de VS Code, listo para asistir en tareas de programación.

---

### Conclusiones

Este tercer intento validó que es completamente viable ejecutar **Ollama + LLM con GPU AMD** en un entorno local si se cumplen ciertas condiciones:

- Utilizar una distro Linux actualizada (como **Manjaro**).
- Evitar los entornos Live para tareas pesadas y optar por instalaciones persistentes.
- Instalar la **extensión correcta** en VS Code (como **Continue**) que se comunique con Ollama local.
- Asegurar que el stack **ROCm esté soportado** por la tarjeta gráfica y el kernel/distribución elegida.

---

### Próximos Pasos

Con Ollama y el modelo llama3 ya operativos, el siguiente paso será evaluar sus capacidades en tareas concretas: generación de código, sugerencias, refactorización ligera y análisis sintáctico, midiendo su utilidad real en proyectos web (HTML/CSS/JS).

Además, se plantea explorar otros modelos más ligeros o específicos (como `codegemma` o `starcoder`) y refinar la instalación para que funcione desde SSD o incluso contenedor portátil.

---
