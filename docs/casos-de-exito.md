# Casos de éxito — Guía para Roberto

Panel de administración: **https://we-offsite.vercel.app/admin/**

## Acceso

1. Abre **https://we-offsite.vercel.app/admin/**
2. Pulsa **Login with GitHub**
3. Autoriza la aplicación con tu cuenta de GitHub (debes tener permiso de escritura en el repositorio)

Tras publicar un cambio, el sitio se actualiza solo en **1–3 minutos** (deploy automático en Vercel).

---

## Editar un caso existente

1. Entra en **Casos de éxito (ES)** o **Case studies (EN)**
2. Selecciona el caso de la lista
3. Modifica los campos que necesites (testimonio, orden, título, etc.)
4. Pulsa **Publish** (arriba a la derecha)

**Importante:** cada caso existe en **dos versiones** (español e inglés). Si cambias el texto en un idioma, revisa si también hay que actualizar el otro.

---

## Añadir un caso nuevo

### Paso 1 — Definir el slug

El **slug** es el identificador de la URL. Ejemplo: `kayzen-phuket` →  
`https://we-offsite.vercel.app/es/case-studies/kayzen-phuket/`

Reglas:
- Solo minúsculas, números y guiones
- **El mismo slug** en la versión ES y EN
- Sin espacios ni tildes

### Paso 2 — Crear la ficha en español

1. **Casos de éxito (ES)** → **New case study (ES)**
2. Rellena todos los campos
3. **Slug:** el identificador elegido (ej. `nuevo-cliente-madrid`)
4. **Orden:** número de posición en la home (1 = primero, 2 = segundo…)
5. **Publish**

### Paso 3 — Crear la ficha en inglés

1. **Case studies (EN)** → **New case study (EN)**
2. Mismo **slug** que en español
3. Contenido traducido al inglés
4. **Publish**

### Paso 4 — Subir fotos

1. Ve a **Media** (icono de imagen en el menú lateral)
2. Navega o crea la carpeta del slug, por ejemplo:  
   `src/assets/case-studies/nuevo-cliente-madrid/`
3. Sube las imágenes con estos nombres:

| Archivo | Uso |
|---------|-----|
| `cover.webp` o `cover.jpg` | Portada (home + cabecera del caso) |
| `01.webp`, `02.webp`, `03.webp`… | Galería (orden numérico) |

Puedes subir JPG o PNG; el sitio las convierte automáticamente a WebP al publicar.

**Consejo:** si no tienes `cover`, se usará la primera imagen de la galería.

---

## Campos del formulario

| Campo | Descripción |
|-------|-------------|
| Slug | Identificador URL (igual en ES y EN) |
| Título / Title | Título del caso |
| Empresa / Company | Nombre del cliente |
| Destino / Location | Ciudad o región |
| Testimonio / Quote | Texto principal del testimonio |
| Autor / Author | Nombre de quien da el testimonio |
| Cargo / Role | Puesto del autor |
| Fecha | Fecha del evento |
| Orden | Posición en listados (menor = más arriba) |
| Cuerpo adicional | Opcional. Segundo testimonio o párrafo extra (markdown) |

---

## Errores frecuentes

| Problema | Solución |
|----------|----------|
| El caso no aparece en la web | Comprueba que existan **ES y EN** con el mismo slug |
| Las fotos no se ven | Revisa la carpeta `src/assets/case-studies/{slug}/` y los nombres `cover` + `01`, `02`… |
| URL incorrecta | El slug solo admite minúsculas y guiones |
| Cambios no visibles | Espera 1–3 min al deploy; recarga con Ctrl+F5 |
| No puedo iniciar sesión | Confirma que tu GitHub tiene acceso de escritura al repo |

---

## Soporte

Si algo falla al publicar, anota el slug del caso y contacta al equipo técnico antes de reintentar borrados masivos.
