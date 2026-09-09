export const ALL_YEARS = {
  code: "Tid",
  selection: { filter: "all", values: ["*"] },
};

export const SCB_ENDPOINTS = {
  houseprice: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BO/BO0501/BO0501B/FastprisSHRegionAr",
    cachePrefix: "houseprice-all",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07EjAggr", values: [city] } },
      { code: "Fastighetstyp", selection: { filter: "item", values: ["220"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["BO0501C2"] } },
      ALL_YEARS,
    ],
  },
  income: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk2",
    cachePrefix: "income-all",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07EjAggr", values: [city] } },
      { code: "Alder", selection: { filter: "item", values: ["20-64"] } },
      { code: "Inkomstklass", selection: { filter: "item", values: ["TOT"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["HE0110K1", "HE0110K2"] } },
      ALL_YEARS,
    ],
  },
  growth: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy",
    cachePrefix: "growth-all",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07", values: [city] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
    ],
  },
  pop: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy",
    cachePrefix: "pop-all",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07", values: [city] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
      { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
      ALL_YEARS,
    ],
  },
  election: {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104C/ME0104T3",
    cachePrefix: "election-all",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07+BaraEjAggr", values: [city] } },
      {
        code: "Partimm",
        selection: {
          filter: "item",
          values: ["M", "C", "FP", "KD", "MP", "S", "V", "SD", "ÖVRIGA"],
        },
      },
      { code: "ContentsCode", selection: { filter: "item", values: ["ME0104B7"] } },
      ALL_YEARS,
    ],
  },
  "election-muni": {
    url: "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104A/ME0104T1",
    cachePrefix: "election-muni-all",
    query: (city) => [
      { code: "Region", selection: { filter: "vs:RegionKommun07+BaraEjAggr", values: [city] } },
      {
        code: "Partimm",
        selection: {
          filter: "item",
          values: ["M", "C", "FP", "KD", "MP", "S", "V", "SD", "ÖVRIGA"],
        },
      },
      { code: "ContentsCode", selection: { filter: "item", values: ["ME0104B2"] } },
      ALL_YEARS,
    ],
  },
};
