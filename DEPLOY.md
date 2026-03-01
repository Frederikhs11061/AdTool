# Deploy AdTool (uden terminal)

Alt kører på Vercel og Convex når du pusher. Ingen behov for at køre noget lokalt.

## Én gang: indstillinger i Vercel

1. **Convex Deploy Key**  
   Gå til [Convex Dashboard](https://dashboard.convex.dev) → dit projekt → **Settings** → **Generate Production Deploy Key**. Kopiér nøglen.

2. **Vercel – Environment Variables**  
   Vercel → AdTool-projekt → **Settings** → **Environment Variables**. Tilføj:

   | Name | Value | Environment |
   |------|--------|-------------|
   | `CONVEX_DEPLOY_KEY` | (indsæt den kopierede nøgle) | Production |
   | `NEXT_PUBLIC_CONVEX_URL` | Din Convex URL (Dashboard → Health → Cloud URL) | Production |

3. **Redeploy**  
   Vercel → **Deployments** → … på seneste deployment → **Redeploy**.

Efter det: ved hver **push til GitHub** bygger Vercel projektet og deployer både Convex-funktioner og Next.js. Du behøver ikke køre `npx convex dev` eller `npx convex deploy` lokalt.
