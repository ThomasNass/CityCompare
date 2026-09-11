import crypto from "crypto";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fetchKoladaCity } from "../lib/kolada.js";
import { fetchScbTable, isScbTable } from "../lib/scb-fetch.js";
import { SCB_ENDPOINTS } from "../lib/scb-queries.js";
import { SKOLVERKET_ENDPOINTS } from "../lib/skolverket-queries.js";

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

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getFromCache(cacheKey) {
  const entry = memoryCache[cacheKey] ?? fileCache[cacheKey];
  if (!entry) return undefined;
  if (entry.cachedAt) {
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return undefined;
    return entry.payload;
  }
  return entry;
}

async function saveToCache(cacheKey, cityData) {
  const entry = { cachedAt: Date.now(), payload: cityData };
  memoryCache[cacheKey] = entry;
  fileCache[cacheKey] = entry;
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

function scbRoute(endpoint) {
  return async (req, res) => {
    try {
      const { city } = req.params;
      const cacheKey = `${endpoint.cachePrefix}-${city.toLowerCase()}`;
      let data = getFromCache(cacheKey);

      if (!data) {
        const result = await fetchScbTable(endpoint.url, endpoint.query(city));
        data = result.data;
        res.status(result.status);
        if (result.status >= 200 && result.status < 300 && isScbTable(data)) {
          await saveToCache(cacheKey, data);
        }
      }

      res.send(data);
    } catch (error) {
      res.status(502).json({ error: error.message || "SCB-anropet misslyckades" });
    }
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

for (const [type, endpoint] of Object.entries(SCB_ENDPOINTS)) {
  app.post(`/api/scb/${type}/:city`, scbRoute(endpoint));
}

for (const [type, endpoint] of Object.entries(SKOLVERKET_ENDPOINTS)) {
  app.post(`/api/skolverket/${type}/:city`, scbRoute(endpoint));
}

app.get("/api/kolada/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const cacheKey = `kolada-school-${city.toLowerCase()}`;
    let data = getFromCache(cacheKey);
    if (!data) {
      const result = await fetchKoladaCity(city);
      data = result.data;
      res.status(result.status);
      if (result.status >= 200 && result.status < 300 && Array.isArray(data?.values) && data.values.length) {
        await saveToCache(cacheKey, data);
      }
    }
    res.send(data);
  } catch (error) {
    res.status(502).json({ error: error.message || "Kolada-anropet misslyckades" });
  }
});

if (isProduction) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`MuniMatch API listening on port ${port}`);
});
