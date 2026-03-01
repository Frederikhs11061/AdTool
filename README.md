# AdTool — AI-Powered Ads (Gro.app-style)

Et værktøj til at generere annonce-creatives ud fra produkter og Meta Ads Library, med deep research på produkt, målgruppe, pain points og angles.

## Features

- **Produkter**: Tilføj produkter og arbejd med dem i en product hub.
- **Create Ads (From Ad Library)**  
  - Vælg "From Ad" → "From Meta Ads Library".  
  - Indsæt link til en ad fra Meta Ads Library (aktiv eller inaktiv).  
  - Ad’en analyseres; du vælger **Variations** (samme layout, dit produkt) eller **New Ads** (samme messaging, nye designs).  
  - Indstillinger: sprog, antal variationer (fx 9), format (Square 1080×1080, Portrait 1440×1800, Stories 1440×2560), custom instructions.  
  - Klik **Generate** for at lave creatives.
- **Creatives**: Se alle genererede ads i et set; muligheder for **Shuffle angles**, **New concepts**, **Switch audience**.
- **Intelligence**: Deep research på produktet med key features, benefits, pain points, use cases, target scenarios, **offers** og **value proposition** (positioning, USPs, competitive advantages). Kør/opdater research fra "Run research".

## Tech stack

- **Next.js 14** (App Router), **React 18**, **Tailwind CSS**
- **Convex** (backend + database – gratis tier, billig skala)
- **Lucide** ikoner

## Convex (database + backend)

Projektet bruger [Convex](https://convex.dev) som backend. Convex har et **generøst gratis tier** og er ofte billigere end at køre egen Postgres.

1. Opret en konto på [convex.dev](https://convex.dev) (gratis).
2. I projektets rod:
   ```bash
   npx convex dev
   ```
   Log ind hvis du bliver bedt om det. Convex opretter et nyt projekt og genererer `convex/_generated/`. Du får en deployment-URL.
3. Sæt i `.env.local`:
   ```env
   NEXT_PUBLIC_CONVEX_URL=<din Convex deployment URL>
   ```
   (`npx convex dev` kan ofte skrive denne fil for dig.)
4. Kør appen:
   ```bash
   npm run dev
   ```

## Kør lokalt

```bash
npm install
npx convex dev   # første gang: log ind og få NEXT_PUBLIC_CONVEX_URL
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000). Opret et produkt under Products, gå ind på det, og brug **Create Ads** for at gennemgå flowet.

## Deploy (Vercel)

1. Push koden til GitHub og forbind Vercel til repoet.
2. I Convex Dashboard: brug **Production** deployment og kopiér deployment-URL.
3. I Vercel: **Settings → Environment Variables** → tilføj `NEXT_PUBLIC_CONVEX_URL` med den URL.
4. Deploy. Ingen ekstra database (Postgres/Neon) er nødvendig – Convex håndterer alt.

## Udvidelser

- **Ad-analyse**: I `convex/actions.ts` (action `analyzeAd`) kan du tilføje kald til Meta Ads Library API eller scrape for rigtig ad-analyse.
- **Billedgenerering**: I `convex/actions.internal.ts` (`insertGenerateResult`) kan du kalde fx **Nano Banana Pro 2** og gemme de genererede image-URL’er i stedet for placeholders.
- **Intelligence/research**: I `convex/actions.ts` (action `runResearch`) kan du bruge LLM + scrape af produkt-URL for mere præcis research.

## Øvrige env-variabler

- API-nøgler til image-gen og evt. LLM (valgfrit)
