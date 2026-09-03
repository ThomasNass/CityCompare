# MuniMatch

En app som jämför kommuner baserat på population, ekonomi, jobb och företagsutbud.

## Installera

```bash
npm install
```

## Utveckling

Startar både Vite-klienten och API-servern:

```bash
npm run dev
```

Öppna [http://localhost:5173](http://localhost:5173). API-anrop mot `/api` proxas till servern på port 3000.

## Produktion

```bash
npm run build
npm start
```

Öppna [http://localhost:3000](http://localhost:3000). Jämförelseappen ligger på startsidan.

## Stack

- React 19 med funktionskomponenter och hooks
- React Router för navigation
- Vite som bundler
- Chart.js och react-chartjs-2 för diagram
- Express som API-proxy mot SCB och hitta.se
- Axios för klientanrop mot Skatteverket och JobTech

## Tjänster

- **Skatteverket** – skattesatser per kommun
- **SCB** – population, inkomst, huspriser och valdata
- **JobTechDev** – jobbannonser
