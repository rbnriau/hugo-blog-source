#!/bin/bash

echo "Buscando archivos .png para convertir..."

# Contador de conversiones
convertidas=0
saltadas=0

# Recorre todos los archivos .png en el directorio actual
for archivo in *.png; do
    # Si no hay archivos .png, termina el bucle
    [ -e "$archivo" ] || continue

    nombre_base="${archivo%.*}"
    salida="$nombre_base.webp"

    # Si ya existe la imagen .webp, se salta
    if [ -f "$salida" ]; then
        echo "Ya existe: $salida → saltando."
        ((saltadas++))
        continue
    fi

    # Convierte a .webp
    echo "Convirtiendo: $archivo → $salida"
    cwebp -q 80 "$archivo" -o "$salida"

    # Verifica y elimina el original
    if [ -f "$salida" ]; then
        rm "$archivo"
        echo "✔ Conversión exitosa: $salida"
        ((convertidas++))
    else
        echo "✖ Error al convertir: $archivo"
    fi
done

echo "--------------------------------------"
echo "Proceso completado."
echo "Imágenes convertidas: $convertidas"
echo "Imágenes ya existentes: $saltadas"
