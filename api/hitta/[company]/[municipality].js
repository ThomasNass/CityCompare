import crypto from "crypto";

const callerId = "MuniPare";
const key = "eoPB4V74FT33z4Yv8zyoyoBg7cG9Y9zlNxO8k49D";

function makeRandom(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req, res) {
  const { company, municipality } = req.query;
  if (!company || !municipality) {
    return res.status(400).json({ error: "Missing company or municipality" });
  }

  const random = makeRandom(16);
  const unixTimestamp = Math.floor(Date.now() / 1000);
  const hashed = crypto.createHash("sha256").update(`${callerId}${unixTimestamp}${key}${random}`).digest("hex");

  const response = await fetch(
    `https://api.hitta.se/publicsearch/v1/companies?what=${encodeURIComponent(company)}&where=${encodeURIComponent(municipality)}&page.number=1&page.size=2`,
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

  const data = await response.json();
  res.status(response.status).json(data);
}
