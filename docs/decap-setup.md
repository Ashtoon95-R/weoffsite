# Decap CMS — Configuración inicial (equipo técnico)

Solo hay que hacer esto **una vez** antes de que Roberto use `/admin/`.

## 1. GitHub OAuth App

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Valores:
   - **Application name:** We Offsite CMS
   - **Homepage URL:** `https://we-offsite.vercel.app`
   - **Authorization callback URL:** `https://we-offsite.vercel.app/api/callback`
3. Crear app → copiar **Client ID** y generar **Client Secret**

## 2. Variables en Vercel

En el proyecto Vercel → **Settings** → **Environment Variables**:

| Variable | Valor |
|----------|--------|
| `GITHUB_CLIENT_ID` | Client ID de la OAuth App |
| `GITHUB_CLIENT_SECRET` | Client Secret |
| `SITE_URL` | `https://we-offsite.vercel.app` (opcional, recomendado) |

Redeploy tras añadir las variables.

## 3. Acceso de Roberto

Invitar a Roberto como **collaborator** en `Ashtoon95-R/weoffsite` con permiso **Write**.

## Notas técnicas

Decap CMS usa un **handshake en dos fases** antes de ir a GitHub:

1. El popup envía `authorizing:github` al panel
2. El panel responde y el popup redirige a GitHub
3. El callback envía `authorization:github:success:{...}`

Por eso `/api/auth` no puede redirigir directamente a GitHub. En Brave (sin `window.opener`) se usa `BroadcastChannel` como puente.

## 4. Verificación

1. Abrir `https://we-offsite.vercel.app/admin/`
2. Login with GitHub → se abre popup → vuelve solo y entra al panel
3. Probar que `/api/auth` redirige a GitHub (no 404)
4. Editar un testimonio de prueba → Publish → comprobar deploy en Vercel

## Archivos relevantes

- [`public/admin/config.yml`](../public/admin/config.yml) — colecciones y campos
- [`public/admin/index.html`](../public/admin/index.html) — carga Decap CMS
- [`api/auth.ts`](../api/auth.ts) — inicio OAuth
- [`api/callback.ts`](../api/callback.ts) — callback OAuth
- [`vercel.json`](../vercel.json) — build con optimización de imágenes

## Desarrollo local

OAuth está configurado para producción. Para probar CMS en local:

- Usar `npx decap-server` con backend `local_backend: true` en config (solo dev), **o**
- Crear una segunda OAuth App con callback `http://localhost:4321/api/callback` (requiere adapter/server local)

Para edición de contenido en local sin CMS, seguir editando MDX en `src/content/case-studies/`.

## Estructura de assets

```
src/assets/case-studies/{slug}/
  cover.webp
  01.webp
  02.webp
  ...
```

El build ejecuta `npm run images:optimize` antes de `astro build` (JPG/PNG → WebP).
