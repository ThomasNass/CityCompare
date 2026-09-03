const SCB_ENDPOINTS = {
  houseprice: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BO/BO0501/BO0501B/FastprisSHRegionAr",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07EjAggr", values: [city] } },
      { code: "Fastighetstyp", selection: { filter: "item", values: ["220"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["BO0501C2"] } },
      { code: "Tid", selection: { filter: "item", values: ["2021"] } },
    ],
  },
  income: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk2",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07EjAggr", values: [city] } },
      { code: "Alder", selection: { filter: "item", values: ["20-64"] } },
      { code: "Inkomstklass", selection: { filter: "item", values: ["TOT"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["HE0110K1", "HE0110K2"] } },
      { code: "Tid", selection: { filter: "item", values: ["2020"] } },
    ],
  },
  growth: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07", values: [city] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
    ],
  },
  pop: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07", values: [city] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
      { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
      { code: "Tid", selection: { filter: "item", values: ["2021"] } },
    ],
  },
  election: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104C/ME0104T3",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07+BaraEjAggr", values: [city] } },
      { code: "Partimm", selection: { filter: "item", values: ["M", "C", "FP", "KD", "MP", "S", "V", "SD", "ÖVRIGA"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["ME0104B7"] } },
      { code: "Tid", selection: { filter: "item", values: ["2018"] } },
    ],
  },
  "election-muni": {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104A/ME0104T1",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07+BaraEjAggr", values: [city] } },
      { code: "Partimm", selection: { filter: "item", values: ["M", "C", "FP", "KD", "MP", "S", "V", "SD", "ÖVRIGA"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["ME0104B2"] } },
      { code: "Tid", selection: { filter: "item", values: ["2018"] } },
    ],
  },
};

export default async function handler(req, res) {
  const { type, city } = req.query;

  const endpoint = SCB_ENDPOINTS[type];
  if (!endpoint || !city) {
    return res.status(400).json({ error: "Invalid type or missing city" });
  }

  const response = await fetch(endpoint.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: endpoint.query(city),
      response: { format: "json" },
    }),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
