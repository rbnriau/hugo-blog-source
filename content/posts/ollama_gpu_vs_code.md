---
title: "Integración de un modelo LLM con VSCode en Linux"
date: 2025-06-29T17:53:14+01:00
draft: false
tags: ["Linux", "Manjaro", "Debian", "LLM"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Intento de usar una GPU AMD en Linux para usar un LLM integrado en VSCode"
canonicalURL: "https://blog.thebytepathchronicles.es/posts/ollama_gpu_vs_code"
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

# Integrar Ollama y Modelos LLM en VS Code (con GPU AMD)

En la era actual de la inteligencia artificial, integrar grandes modelos de lenguaje (LLM) directamente en el entorno de desarrollo es una capacidad cada vez más deseada. Herramientas como Ollama permiten ejecutar estos modelos de forma local, aprovechando la potencia de nuestras GPU. Sin embargo, la implementación de esta solución no siempre es un camino de rosas, especialmente cuando se trabaja con hardware AMD y distribuciones Linux específicas. Este artículo documenta los desafíos encontrados al intentar integrar Ollama y un LLM para asistencia en la codificación en VS Code, utilizando una GPU AMD Radeon RX Vega 56, en dos entornos Linux diferentes: Debian 12 y Manjaro Live USB.

---

### Intento 1: Debian 12

El primer intento se centró en la distribución principal: Debian 12 "Bookworm". La instalación de Ollama en Debian es teóricamente sencilla, siguiendo los pasos oficiales.

**Pasos Intentados:**

1. Instalación de `curl`: `sudo apt install curl`  
2. Instalación de Ollama: `curl -fsSL https://ollama.com/install.sh | sh`  
3. Intento de descarga y ejecución del modelo Llama 3: `ollama run llama3`

**Problemas Encontrados:**

Durante la ejecución de `ollama run llama3`, el proceso fallaba con errores relacionados con la **incapacidad de Ollama para detectar y utilizar correctamente la GPU AMD Radeon RX Vega 56**. A pesar de que la GPU era reconocida por el sistema y los drivers `amdgpu` estaban cargados, Ollama requería el *stack* de software de **ROCm (Radeon Open Compute platform)** para el cómputo GPGPU (General-Purpose computing on Graphics Processing Units).

**Diagnóstico del Problema con ROCm en Debian 12:**

* **Drivers AMDGPU desactualizados:** Debian 12, al ser una distribución de ciclo de lanzamiento "stable", prioriza la estabilidad sobre las versiones más recientes de software. Esto se traduce en que los drivers `amdgpu` y el *firmware* asociado, aunque funcionales para el uso gráfico general, no eran lo suficientemente nuevos o completos para proporcionar el soporte de ROCm que Ollama necesita para la Vega 56.  
* **Problemas de monitoreo:** Se observó que herramientas como `sensors` reportaban RPM de ventiladores inactivos (ej. 1300 RPM) incluso cuando los ventiladores de la GPU estaban parados, indicando una comunicación incompleta o incorrecta entre el driver y el hardware a un nivel profundo, probablemente relacionado con la falta de un *stack* ROCm completo.  
* **Ausencia del *bundle* de ROCm:** Ollama no lograba descargar ni configurar el "Linux ROCm amd64 bundle" necesario, confirmando que el entorno de Debian 12 no presentaba las condiciones o dependencias que Ollama esperaba para habilitar la aceleración por GPU.

**Conclusión del Intento 1:** La versión de ROCm y los drivers AMDGPU disponibles de forma nativa en Debian 12 no son suficientes o compatibles para el funcionamiento de Ollama con la Radeon RX Vega 56 sin una configuración manual compleja que va más allá de lo "plug-and-play".

---

### Intento 2: Manjaro Live USB

Dada la necesidad de un *stack* ROCm más reciente, se decidió probar un entorno Linux de tipo "rolling release", como Manjaro, conocido por sus paquetes actualizados. El objetivo era verificar si la GPU funcionaría correctamente con Ollama en un Live USB antes de considerar una instalación permanente.

**Pasos Intentados:**

1. Preparación del Live USB: Se formateó un pendrive de 32 GB con una tabla de particiones GPT en Debian 12 para asegurar una limpieza completa.  
2. Flasheo de la ISO de Manjaro (GNOME, versión mínima) al pendrive.  
3. Arranque del sistema desde el Live USB de Manjaro.  
4. Actualización de paquetes (`sudo pacman -Syu`) e instalación de `curl`, `lm_sensors`, `radeontop`.  
5. Instalación de Ollama: `curl -fsSL https://ollama.com/install.sh | sh`  
6. Intento de descarga y ejecución de un modelo pequeño (`ollama run tinyllama` o `ollama run phi3:mini`) para conservar espacio.

**Problemas Encontrados:**

Durante la instalación de Ollama (específicamente durante la descarga del "Linux ROCm amd64 bundle"), el sistema se congeló y, en un intento posterior, reportó **errores de falta de espacio en disco**, a pesar de que el pendrive era de 32 GB y herramientas como GParted indicaban que aún quedaban **aproximadamente 27 GB sin usar**.

**Posibles Causas del Error de "Falta de Espacio" en un Live USB con Espacio Suficiente:**

Este comportamiento, aparentemente contradictorio, es común en los entornos Live USB y se debe a cómo gestionan el espacio de escritura:

* **Sistema de Archivos `iso9660` y `overlayfs`:** Las imágenes ISO flasheadas en USB suelen crear un sistema de archivos `iso9660` (de solo lectura, como un CD/DVD) para el sistema operativo base. Cualquier cambio o archivo nuevo (como la instalación de Ollama y el bundle de ROCm) se escribe en una capa de "overlay filesystem" (conocida como `overlayfs`). Esta capa utiliza un espacio temporal en la RAM (`tmpfs`) y/o una sección del USB no particionada o dedicada como un *scratchpad* o área de escritura.  
* **Limitaciones del `overlayfs`:** Aunque el pendrive físico tenga mucho espacio, el tamaño de la capa de `overlayfs` (o el espacio de escritura disponible para el usuario) puede ser limitado. No siempre utiliza la totalidad del espacio "no asignado" del pendrive de manera directa y transparente para el usuario. Es posible que Manjaro Live haya asignado solo una cantidad fija para esta capa de escritura, que no fue suficiente para el bundle de ROCm (que puede ser de varios GB).  
* **Saturación de RAM:** La instalación de paquetes grandes y complejos, como el bundle de ROCm, es una operación intensiva que requiere mucha RAM para la descompresión y procesamiento de archivos. Aunque el sistema contara con 16 GB de RAM física, el entorno Live USB, junto con aplicaciones abiertas, puede haber agotado la RAM disponible para la capa de `overlayfs` antes de poder volcar los datos finales al USB, lo que llevó al congelamiento y al error de espacio. La falta de un archivo/partición de *swap* persistente y eficiente en el Live USB agrava este problema.  
* **Fragmentación o gestión interna:** Aunque GParted muestre "espacio libre", la forma en que el Live USB gestiona internamente ese espacio o posibles fragmentaciones lógicas (aunque sea un USB recién formateado) podría haber contribuido al fallo.

**Conclusión del Intento 2:** Aunque Manjaro mostró la capacidad de iniciar la instalación de ROCm, el entorno limitado de un Live USB (específicamente la gestión de la RAM y el espacio de escritura temporal) resultó ser un cuello de botella para la instalación de componentes tan grandes como el *bundle* de ROCm.

---

### Reflexión Final

Esta serie de intentos para integrar Ollama con una GPU AMD en Linux reveló varias lecciones clave:

1. **Drivers y ROCm:** Para el *machine learning* y las capacidades GPGPU de las tarjetas AMD Radeon, es fundamental utilizar una distribución Linux que ofrezca **drivers AMDGPU y versiones de ROCm lo suficientemente recientes y completas**. Las distribuciones *rolling release* (como Manjaro, Arch) o aquellas con acceso a repositorios de hardware más actualizados (como Ubuntu LTS ), son preferibles a las *stable* como Debian 12 para estas tareas.  
2. **Limitaciones de los Live USB:** Los entornos Live son excelentes para probar una distribución o para tareas de rescate. Sin embargo, no son adecuados para instalaciones de software grandes y complejas que requieren mucho espacio de disco persistente o un uso intensivo de RAM, debido a cómo gestionan su espacio de escritura temporal.  
3. **Prioridad del Objetivo:** Aunque la tecnología de IA local es fascinante, es crucial evaluar si la funcionalidad es realmente indispensable para el propio flujo de trabajo. La estabilidad y fiabilidad de una distribución como Debian a menudo superan la necesidad de las últimas características de IA integrada en IDEs.

---

### Próximo Intento: Instalación persistente en USB

Como siguiente paso, se planifica realizar una **instalación completa y persistente de Manjaro (o una distribución similar) directamente en el pendrive USB de 32 GB**, en lugar de usar un entorno Live USB. Esta configuración permitirá un sistema funcional con persistencia total de datos, gestión completa del espacio en disco y acceso nativo a los drivers y frameworks necesarios, facilitando la instalación y uso de Ollama con soporte para GPU AMD. Este intento se documentará en detalle una vez realizado.(como adelanto, con éste tercer intento se consigió integrar un modelo en VSCode y se llego a probar como asistente en codificación html y css ).

---


