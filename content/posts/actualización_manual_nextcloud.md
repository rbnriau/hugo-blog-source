---
title: "Actualización manual de Nextcloud"
date: 2025-10-30T11:30:03+00:00
description: "En este artículo anotaré los pasos para guardar copias de seguridad antes de actualizar Nextcloud manualmente."
# weight: 1
# aliases: ["/first"]
tags: ["nextcloud", "debian", "seguridad", "linux"]
author: "Ruben Riau Vicente"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false

canonicalURL: "https://blog.thebytepathchronicles.es/posts/actualizacion_manual_nextcloud/"

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


## 1. Copias de seguridad
Antes de cualquier cambio, realizamos backups completos:
- Archivos de Nextcloud:
```
sudo tar -czvf nextcloud-files-backup.tar.gz /var/www/nextcloud
```
- Base de datos (MariaDB/MySQL):
```
mysqldump -u nextcloud_user -p nextcloud > nextcloud-db-backup.sql
```
- Archivos de configuración importantes:
```
sudo cp /var/www/nextcloud/config/config.php ~/backup_config.php
```
Advertencia: Siempre verificamos que los permisos y propietarios sean correctos antes de cualquier restauración.

## 2. Activar modo mantenimiento
```
sudo -u www-data php /var/www/nextcloud/occ maintenance:mode --on
```
## 3. Descargar nueva versión
- Descargamos la versión ZIP desde el sitio oficial de Nextcloud a nuestro PC local.
- Subimos el archivo comprimido al servidor vía scp o SFTP.
```
scp Descargas/nextcloud-32.0.1.tar.bz2 usuario@ip/nombre-servidor:/tmp/
nextcloud-32.0.1.tar.bz2                      100%  257MB   2.1MB/s   02:03
```
    
- Descomprimimos en un directorio temporal:
```
tar -xjf nextcloud-32.0.1.tar.bz2
```


## 4. Preparación de la actualización manual
- Movemos la instalación actual a -old:
```
sudo mv /var/www/nextcloud /var/www/nextcloud-old
```
- Movemos la nueva versión a /var/www/nextcloud:
```
sudo mv /tmp/nextcloud /var/www/nextcloud
```
- Copiamos la carpeta config y data de la versión anterior a la nueva:
```
sudo cp -a /var/www/nextcloud-old/config /var/www/nextcloud/
sudo cp -a /var/www/nextcloud-old/data /var/www/nextcloud/
```
- Ajustamos permisos:
```
sudo chown -R www-data:www-data /var/www/nextcloud
sudo find /var/www/nextcloud/ -type d -exec chmod 750 {} \;
sudo find /var/www/nextcloud/ -type f -exec chmod 640 {} \;
```
## 5. Actualización de la base de datos y apps
- Accedemos al actualizador desde el dashboard o usamos:
Advertencia: Recordar: Apache debe estar detenido antes de ejecutar el updater.
```
sudo -u www-data php /var/www/nextcloud/occ upgrade
```
- Levantamos apache2
```
sudo systemctl start apache2
```

- Durante la actualización, Nextcloud crea versiones -old_* de las carpetas de apps si es necesario.
- Se verifican y actualizan todas las apps instaladas.
- Eventuales errores menores se resolvieron revisando permisos o moviendo manualmente archivos faltantes.
## 6. Finalización
- Desactivamos modo mantenimiento( si se ha actualizado desde el dashboard, el instalador lo desactivará automáticaente)
```
sudo -u www-data php /var/www/nextcloud/occ maintenance:mode --off
```
- Verificamos acceso al dashboard y que todas las apps funcionen correctamente.
- Revisión final de logs:
```
sudo tail -f /var/www/nextcloud/updater-*/updater.log
sudo tail -f /var/www/nextcloud/nextcloud.log
```
Advertencia: Siempre conservar las carpetas *-old  y .bakups hasta verificar que todo funciona, luego pueden eliminarse.


