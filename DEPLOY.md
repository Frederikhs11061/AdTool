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

---

## Valgfrit: sprogmodel + billedgenerering (Claude + Nano Banana Pro 2)

For **unikke koncepter** (audience, angle, concept) og **rigtig billedgenerering** skal du sætte disse miljøvariabler i **Convex Dashboard** → dit projekt → **Settings** → **Environment Variables**:

| Name | Beskrivelse |
|------|-------------|
| `ANTHROPIC_API_KEY` | Din Anthropic API-nøgle (Claude). Bruges til at generere unikke audience/angle/concept og copy fra research. |
| `NANO_BANANA_API_KEY` | API-nøgle til Nano Banana Pro 2 (fx fra [defapi.org](https://api.defapi.org) eller tilsvarende). Bruges til at generere ad-billeder. |
| `NANO_BANANA_API_URL` | (Valgfri) Base URL, fx `https://api.defapi.org`. Default er defapi.org. |
| `NANO_BANANA_MODEL` | (Valgfri) Model, fx `google/gempix2` eller `google/gemini-2.5-flash-image`. |

Uden disse bruger appen fallback-logik (ingen LLM) og placeholder-billeder.
