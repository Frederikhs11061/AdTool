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
- **Prisma** + **SQLite** (kan skiftes til Postgres)
- **Lucide** ikoner

## Kør lokalt

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000). Opret et produkt under Products, gå ind på det, og brug **Create Ads** for at gennemgå flowet.

## API-er (udvidelser)

- **`/api/ads/analyze`**  
  Analyserer en Meta Ads Library-URL. I dag bruges placeholder-logik; her kan du tilføje scrape eller officiel API og gemme angle/hook/visual.

- **`/api/ads/generate`**  
  Opretter et CreativeSet og N creatives. Billed-URL’er er i dag placeholders (`placehold.co`). Her kan du integrere **Nano Banana Pro 2** (eller anden image-gen API) og erstatte placeholder-URL’er med rigtige genererede billeder.

- **`/api/intelligence/research`**  
  Kører “deep research” på produktet og udfylder Intelligence. I dag bruges template-data baseret på produktnavn; her kan du tilføje LLM + scrape af produkt-URL for rigtige features, offers og value proposition.

## Nano Banana Pro 2

For rigtig billedgenerering/redigering kan du bruge fx:

- [Nano Banana Pro API](https://nanobananaproapi.com/) eller  
- [Replicate google/nano-banana-pro](https://replicate.com/google/nano-banana-pro)

I `src/app/api/ads/generate/route.ts`: erstat loopet der opretter `Creative` med kald til din valgte API med prompt baseret på `analyzedAd`, product intelligence og `customInstructions`, og gem den returnerede image URL i `creative.imageUrl`.

## Miljø

Opret evt. `.env` med:

- `DATABASE_URL` (ved brug af Postgres)
- API-nøgler til image-gen og evt. LLM til research/analyze

Prisma bruger som standard `file:./dev.db` (SQLite) uden ekstra env.
