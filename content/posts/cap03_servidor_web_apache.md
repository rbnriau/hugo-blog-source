---
title: "Configuración de Apache2 en Debian 12"
date: 2025-06-25T15:57:47+01:00
draft: true
tags: ["Linux", "Debian", "Apache2"]
author: "Rubén Riau"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "Configuración inicial de Apache2"
canonicalURL: "https://blog.thebytepathchronicles.es"
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

## Introducción

En este capítulo profundizaré en la configuración de Apache2 en nuestro entorno local de pruebas.
Recordemos la configuración de red:
- Hostname del servidor: 1-bytepath
- Dirección IP del servidor: 192.168.8.150/24 (estatica)
- Red local: 192.168.8.0/24
En el capítulo 1 ya instalamos Apache pero antes de empezar nos aseguramos de que Apache esté funcionando correctamente.
1. Comprobar el estado del servicio:
![comprobar](/img/cap03_servidor_web_apache/A1C3N01.webp)
2. Acceder a la página web por defecto de Apache2:
![acceder](/img/cap03_servidor_web_apache/A1C3N02.webp)
Recordemos que en el capítulo anterior eliminamos la pagina web por defecto de Apache por seguridad.


## Estructura de directorios y archivos de configuración de Apache2.

- Directorio principal de configuración de Apache2.
```bash
 /etc/apache2/
```
- El archivo de configuración principal. Contiene directivas globales.
```bash
/etc/apache2/apache2.conf
```
- Define los puertos en los que Apache2 escucha (por defecto 80 para HTTP y 443 para HTTPS).
```bash
/etc/apache2/ports.conf
```
- Contiene enlaces simbólicos a los módulos que están actualmente habilitados.
```bash
/etc/apache2/mods-available/
```
- Contiene enlaces simbólicos a los módulos que están actualmente habilitados.
```bash
/etc/apache2/conf-available/
```
- Contiene enlaces simbólicos a las configuraciones que están actualmente habilitadas.
 ```bash
/etc/apache2/conf-enabled/
```
- Contiene archivos de configuración para los Virtual Hosts disponibles (sitios web).

```bash
/etc/apache2/sites-available/
```
- Contiene enlaces simbólicos a los Virtual Hosts que están actualmente habilitados
```bash
/etc/apache2/sites-enabled/
```
- El directorio por defecto para los archivos del sitio web.
 ```bash
/var/www/html/
```
## Comandos útiles
- Habilita un módulo.
 ```bash
a2enmod
 ```
- Deshabilita un módulo.
 ```bash
a2dismod
```
- Habilita un Virtual Host. 
```bash
a2ensite
```
- Deshabilita un Virtual Host.
 ```bash
a2dissite
```
- Lista los módulos habilitados.
 ```bash
a2query -m
```
- Comprueba la sintaxis de los archivos de configuración antes de reiniciar Apache.
 ```bash
apache2ctl configtest
```

## Creación de un virtual host para el sitio web

En lugar de usar el directorio por defecto (/var/www/html) crearemos un Virtual Host para nuestro sitio web, esto nos permite alojar varios sitios en el mismo servidor si fuese necesario en el futuro.
1. Crear el directorio raíz  
 
![Raiz](/img/cap03_servidor_web_apache/A1C3N03.webp)

2. Asignar permisos adecuados al directorio.

![asignar](/img/cap03_servidor_web_apache/A1C3N04.webp)

3. Crear una página de prueba.(copio la que tenemos por defecto)
 
![crear](/img/cap03_servidor_web_apache/A1C3N05.webp)

4. Y la edito, se quedará así de momento hasta que diseñe la portada del sitio web.


![editar](/img/cap03_servidor_web_apache/A1C3N06.webp)

## Configurar el Virtual Host

![conf](/img/cap03_servidor_web_apache/A1C3N07.webp)

Habilitar el nuevo sitio.

![enable](/img/cap03_servidor_web_apache/A1C3N08.webp)

Verificamos y reiniciamos apache

![verificar](/img/cap03_servidor_web_apache/A1C3N09.webp)

Deshabilitamos el sitio por defecto. Ya que apunta al mismo puerto, debemos deshabilitarlo para que tome el nuevo host virtual en el puerto 80.

![disable](/img/cap03_servidor_web_apache/A1C3N10.webp)


![comprobar](/img/cap03_servidor_web_apache/A1C3N11.webp)

Comprobamos que la página por defecto ahora es la del nuevo host virtual.

![portada](/img/cap03_servidor_web_apache/A1C3N12.webp)

## Explicación de las directivas importantes

- ```bashDocumentRoot``` Define la Raíz del documento para este Host virtual.
- ```bashServerName``` El nombre de dominio o hostname que Apache usará para identificar este Virtual Host.

-  Este bloque configura opciones específicas para el directorio del sitio.
   - ```bashOptions Indexes FollowSymLinks MultiViews``` Habilita indexacción de directorios, seguimiento de enlaces simbólicos y negociación de contenido. 
     - La opción Indexes es recomendable quitarla en producción, más adelante se explica el porqué de esta medida.
   - ```bashAllowOverride All``` Permite el uso de archivos .htaccess para anular configuraciones, autenticación, redirecciones. 
     - Este fichero .htaccess lo usaremos cuando configuremos Apache para dirigir tráfico HTTPS.
   - ```bashRequire all granted``` Permite el acceso desde cualquier dirección IP.


## Habilitación de Módulos comunes y útiles
Apache está diseñado modularmente lo que nos permite habilitar o deshabilitar funcionalidades específicas.
Esto nos permite mantener un servidor ligero y seguro al cargar sólo lo necesario.
1. Listar módulos disponibles y habilitados
   
![listar modulos](/img/cap03_servidor_web_apache/A1C3N14.webp)

![habilitados](/img/cap03_servidor_web_apache/A1C3N15.webp)

2. Módulos útiles y esenciales para un blog

```bash
mod_headers
```
- Este módulo permite manipular cabeceras HTTP que Apache envía en sus respuestas.
útil para configurar cabeceras de seguridad que mejoran la protección del sitio contra varios tipos de ataques
```bash
sudo a2enmod headers
```
 ```bash
mod_deflate
```
- Habilita la compresión de contenido (GZIP) para archivos como HTML,CSS y JavaScript. Esto reduce el tamaño de los datos que se envían al navegador del ususario, lo que resulta en tiempos de carga más rápidos y un menor consumo de ancho de banda. 
```bash
sudo a2enmod deflate
```
```bash
sudo systemctl restart apache2
```
- Para configurarlo creamos un archivo de configuración específico:
```bash
sudo nano /etc/apache2/conf-available/deflate.conf
```
![deflate.conf](/img/cap03_servidor_web_apache/A1C3N16.webp)
      - Y habilitamos esta configuración:
```bash
sudo a2enconf deflate.conf
```
![enable deflate](/img/cap03_servidor_web_apache/A1C3N17.webp)
```bash
mod_expires
```
-  Este módulo permite añadir cabeceras 'Expires' y 'Cache-Control' a los archivos estáticos e indica al navegador del usuario durante cuánto tiempo puede almacenar en caché estos archivos evitando que el navegador los solicite de nuevo en visitas posteriores, reduciendo la carga del servidor y mejorando drásticamente la velocidad de carga para visitantes recurrentes.
-  Podemos configurarlo en el mismo archivo de configuración del virtual host pero prefiero hacer una archivo de configuración específico para este módulo, tal como hicimos con el módulo deflate.
-  Este asunto es complejo y puede tener consecuencias si no se comprende bien:
-  La habilitación de un módulo es 'global', por tanto, todos los sitios incluidos en el servidor se verán afectados.
-  Los módulos necesitan una configuración, no la tienen por defecto, por tanto, cualquier módulo habilitado sin configuración no servirá de nada.
-  La configuración de los módulos pueden incluirse en varios sitios:
  -  En su propio archivo de configuración como hemos hecho anteriormente.(configuración global, afecta a todos los sitios)
  -  Dentro del archivo de configuración del Virtual Host(afectará a ese sitio solamente). Por tanto, si configuramos el módulo dentro del Virtual Host, la configuración no afectará a los demás sitios que aunque esté activado no disponen de una configuración y no servirá de nada el que esté activado.
-  Habilitamos mod_expires:
```bash
sudo a2enmod expires
```
```bash
sudo systemctl restart apache2
```
-  Creamos el archivo de configuración para mod_expires:
```bash
sudo nano /etc/apache2/conf-available/expires.conf
```
![Crear conf](/img/cap03_servidor_web_apache/A1C3N18.webp)
-  Y habilitamos la nueva configuración:
```bash
sudo a2enconf expires.conf
```
-  Verificamos la sintaxis y reiniciamos el servicio.
```bash
sudo apache2ctl configtest
```
```bash
sudo systemctl restart apache2
```

## Configuración de Seguridad Adicional en Apache2.
   
   
1. **Deshabilitar la visualización de la versión de Apache y del sistema operativo:**
   Como se explicó en el capítulo anterior sobre seguridad básica, es crucial evitar que Apache revele su versión y el sistema operativo, ya que esta información puede ser valiosa para posibles atacantes.
   Ya configuramos estas directivas en el archivo /etc/apache2/conf-available/security.conf.
     
![Crear conf](/img/cap03_servidor_web_apache/A1C3N23.webp)

2. **Configurar opciones para el directorio raíz:**
   Ya se comentó anteriormente, debería eliminarse la opción 'Indexes' para prevenir que en caso de error un atacante no pueda acceder a un listado de directorios del sitio web.

[Crear conf](/img/cap03_servidor_web_apache/A1C3N19.webp)

3. **Configurar cabeceras de seguridad con mod_headers**
```bashsudo a2enmod headers```
 Creamos una archivo de configuración para las cabeceras de seguridad.

 ![Crear conf](/img/cap03_servidor_web_apache/A1C3N20.webp)

Habilitamos la nueva configuración

```bashsudo a2enconf security_headers.conf```

Testeamos la sintaxis y reiniciamos el servicio.

```bashsudo apache2ctl configtest```

```bashsudo systemctl restart apache2```

Con esta configuración, a partir de ahora, a cualquier sitio creado en el servidor se le aplicarán las cabeceras de seguridad ( excepto HSTS que están comentadas por que se activarán conado configuremos el tráfico HTTPS).

4. **Limitar el tamaño del cuerpo de la petición**
   Esto previene ataques de denegación de servicio (DoS) al evitar que un atacante envíe datos POST demasiado grandes que podrían agotar los recursos del servidor.
   Al igual que con las cabeceras de seguridad, podemos establecer esta limitación de manera global para todos nuestros Virtual Host.

   Creamos un archivo de configuración para 'LimitRequestBody':

   ```bashsudo nano /etc/apache2/conf-available/request_limits.conf```

   Añadimos la directiva de limitación:

![Crear conf](/img/cap03_servidor_web_apache/A1C3N21.webp)

   Habilitamos esta nueva configuración:

   ```bashsudo a2enconf request_limits.conf```

   Verificamos la sintaxis y reiniciamos el servicio:

   ```bashsudo apache2ctl configtest```
   ```bashsudo systemctl restart apache2```

   Con esto, cualquier petición que intente enviar un cuerpo de datos superior a 10MB será denegada por Apache, protegiendo nuestros recursos.

5. **Asegurar los directorios de log**
   Debemos verificar los permisos actuales de los archivos de log.
   
   Los archivos deben ser propiedad de www-data o root y el grupo adm con permisos de lectura -rw-r-----

![Crear conf](/img/cap03_servidor_web_apache/A1C3N22.webp)

   Si los permisos son diferentes o mas laxos deberían ajustarse.
   - 📌 Nota: adm es el grupo por defecto en Debian para los logs. En otras distribuciones podría ser root o syslog.
  
6. **Desactivar módulos innecesarios**
   Cuantos menos módulos estén activos menos seran las posibles vulnerabilidades que explotar.

   Listar los módulos actualmente habilitados:

   ```basha2query -m```

   Revisar cuidadosamente esta lista e identificar cualquier módulo cuya funcionalidad no sea estrictamente necesaria.

   En mi caso he seleccionado 3 módulos para eliminar:

   ```bashsudo a2dismod status```

   ```bashsudo a2dismod access_compat```

   ```bashsudo a2dismod autoindex -f```

   Verificamos sintaxis y reiniciamos serviciio.

 7. **Monitorización de Logs de Apache**

La monitorización constante es una práctica indispensable para la depuración, análisis de tráfico y detección temprana de posibles problemas o actividades maliciosas.

- **Logs de acceso**
  ```bashsudo tail -f /var/log/apache2/access.log```

- **Logs de error**
  
   ```bashsudo tail -f /var/log/apache2/error.log```


## ✅ Cierre del capítulo

📌 **Resumen rápido**  
   - **Virtual Hosts:** Hemos configurado un sitio web completo (origen) usando Virtual Hosts, deshabilitando el sitio por defecto de Apache.
   - **Gestión de Módulos:** Aprendimos la importancia de habilitar (a2enmod) y configurar (a2enconf) módulos clave como deflate, expires, y headers de forma modular y global para optimizar el rendimiento y la seguridad.
   - **Seguridad Esencial:** Hemos implementado medidas de seguridad críticas, incluyendo:
     -  Ocultar la versión del servidor.
     -  Evitar el listado automático de directorios (Indexes).
     -  Establecer cabeceras HTTP de seguridad (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy).
     - Limitar el tamaño del cuerpo de las peticiones para prevenir ataques DoS.
     - Asegurar los permisos de los directorios de log.
     - Deshabilitar módulos innecesarios (status, access_compat, autoindex).
   - **Monitorización:** Comprendimos la importancia de los logs de acceso y error de Apache para depurar y mantener el servidor. 

🔧 **Estado actual del entorno**  
El servidor Apache2 en Debian 12 está ahora configurado con un Virtual Host funcional y modular, listo para servir tu blog. Hemos aplicado una serie de optimizaciones de rendimiento (compresión, caché de navegador) y, lo que es más importante, un conjunto robusto de medidas de seguridad a nivel de servidor, incluyendo la protección de acceso a directorios y la mitigación de ataques comunes. El entorno está más seguro, eficiente y preparado para el futuro.

🚀 **¿Y ahora qué?**  
El siguiente paso  es dar vida al blog. En el próximo capítulo explicaré como se está diseñado el contenido web estático.

💬 **Bitácora del viajero**  
> *""El servidor es el lienzo; ahora es el momento de empezar a pintar nuestra historia digital."*

