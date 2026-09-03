import crypto from "crypto";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const callerId = "MuniPare";
const key = "eoPB4V74FT33z4Yv8zyoyoBg7cG9Y9zlNxO8k49D";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const cachePath = path.join(__dirname, "cache.json");
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

const app = express();
const memoryCache = {};
let fileCache = {};

try {
  fileCache = JSON.parse(await fs.readFile(cachePath, "utf8"));
} catch {
  fileCache = {};
}

function getFromCache(cacheKey) {
  return memoryCache[cacheKey] ?? fileCache[cacheKey];
}

async function saveToCache(cacheKey, cityData) {
  memoryCache[cacheKey] = cityData;
  fileCache[cacheKey] = cityData;
  await fs.writeFile(cachePath, JSON.stringify(fileCache, null, 2));
}

function makeRandom(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function sha256(message) {
  return crypto.createHash("sha256").update(message).digest("hex");
}

async function fetchScb(url, query) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      response: { format: "json" },
    }),
  });
  return {
    status: response.status,
    data: await response.json(),
  };
}

function scbRoute(cachePrefix, url, buildQuery) {
  return async (req, res) => {
    const { city } = req.params;
    const cacheKey = `${cachePrefix}-${city.toLowerCase()}`;
    let data = getFromCache(cacheKey);

    if (!data) {
      const result = await fetchScb(url, buildQuery(city));
      data = result.data;
      res.status(result.status);
      await saveToCache(cacheKey, data);
    }

    res.send(data);
  };
}

app.get("/api/hitta/:company/:municipality", async (req, res) => {
  const { company, municipality } = req.params;
  const cacheKey = `hitta-${company.toLowerCase()}-${municipality.toLowerCase()}`;
  let data = getFromCache(cacheKey);

  if (!data) {
    const random = makeRandom(16);
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const hashed = sha256(`${callerId}${unixTimestamp}${key}${random}`);
    const response = await fetch(
      `https://api.hitta.se/publicsearch/v1/companies?what=${company}&where=${municipality}&page.number=1&page.size=2`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "hitta-callerid": callerId,
          "hitta-time": String(unixTimestamp),
          "hitta-random": random,
          "hitta-hash": hashed,
        },
      }
    );
    data = await response.json();
    if (response.ok) {
      await saveToCache(cacheKey, data);
    }
  }

  res.send(data);
});

app.post(
  "/api/scb/houseprice/:city",
  scbRoute(
    "houseprice",
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BO/BO0501/BO0501B/FastprisSHRegionAr",
    (city) => [
      {
        code: "Region",
        selection: { filter: "vs:RegionKommun07EjAggr", values: [city] },
      },
      {
        code: "Fastighetstyp",
        selection: { filter: "item", values: ["220"] },
      },
      {
        code: "ContentsCode",
        selection: { filter: "item", values: ["BO0501C2"] },
      },
      {
        code: "Tid",
        selection: { filter: "item", values: ["2021"] },
      },
    ]
  )
);

app.post(
  "/api/scb/income/:city",
  scbRoute(
    "income",
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk2",
    (city) => [
      {
        code: "Region",
        selection: { filter: "vs:RegionKommun07EjAggr", values: [city] },
      },
      {
        code: "Alder",
        selection: { filter: "item", values: ["20-64"] },
      },
      {
        code: "Inkomstklass",
        selection: { filter: "item", values: ["TOT"] },
      },
      {
        code: "ContentsCode",
        selection: { filter: "item", values: ["HE0110K1", "HE0110K2"] },
      },
      {
        code: "Tid",
        selection: { filter: "item", values: ["2020"] },
      },
    ]
  )
);

app.post(
  "/api/scb/growth/:city",
  scbRoute(
    "growth",
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy",
    (city) => [
      {
        code: "Region",
        selection: { filter: "vs:RegionKommun07", values: [city] },
      },
      {
        code: "ContentsCode",
        selection: { filter: "item", values: ["BE0101N1"] },
      },
    ]
  )
);

app.post(
  "/api/scb/pop/:city",
  scbRoute(
    "pop",
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy",
    (city) => [
      {
        code: "Region",
        selection: { filter: "vs:RegionKommun07", values: [city] },
      },
      {
        code: "ContentsCode",
        selection: { filter: "item", values: ["BE0101N1"] },
      },
      {
        code: "Kon",
        selection: { filter: "item", values: ["1", "2"] },
      },
      {
        code: "Tid",
        selection: { filter: "item", values: ["2021"] },
      },
    ]
  )
);

app.post(
  "/api/scb/election/:city",
  scbRoute(
    "election",
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104C/ME0104T3",
    (city) => [
      {
        code: "Region",
        selection: { filter: "vs:RegionKommun07+BaraEjAggr", values: [city] },
      },
      {
        code: "Partimm",
        selection: {
          filter: "item",
          values: ["M", "C", "FP", "KD", "MP", "S", "V", "SD", "ÖVRIGA"],
        },
      },
      {
        code: "ContentsCode",
        selection: { filter: "item", values: ["ME0104B7"] },
      },
      {
        code: "Tid",
        selection: { filter: "item", values: ["2018"] },
      },
    ]
  )
);

app.post(
  "/api/scb/election-muni/:city",
  scbRoute(
    "election-muni",
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104A/ME0104T1",
    (city) => [
      {
        code: "Region",
        selection: { filter: "vs:RegionKommun07+BaraEjAggr", values: [city] },
      },
      {
        code: "Partimm",
        selection: {
          filter: "item",
          values: ["M", "C", "FP", "KD", "MP", "S", "V", "SD", "ÖVRIGA"],
        },
      },
      {
        code: "ContentsCode",
        selection: { filter: "item", values: ["ME0104B2"] },
      },
      {
        code: "Tid",
        selection: { filter: "item", values: ["2018"] },
      },
    ]
  )
);

if (isProduction) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`MuniMatch API listening on port ${port}`);
});
