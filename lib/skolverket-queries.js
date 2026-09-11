const ALL_TIME = {
  code: "time",
  selection: { filter: "all", values: ["*"] },
};

export const SKOLVERKET_ENDPOINTS = {
  "preschool-units": {
    cachePrefix: "skv-preschool-units",
    url: "https://statistikdatabasen.skolverket.se/PxWeb/api/v1/sv/Skolverkets_statistikdatabas/Kommunala_jamforelsetal/Forskola/Barn_och_grupper/Forskola_barn_grupper.px",
    query: (city) => [
      { code: "variable", selection: { filter: "item", values: ["0", "1"] } },
      { code: "level", selection: { filter: "item", values: [city] } },
      ALL_TIME,
    ],
  },
  "compulsory-units": {
    cachePrefix: "skv-compulsory-units",
    url: "https://statistikdatabasen.skolverket.se/PxWeb/api/v1/sv/Skolverkets_statistikdatabas/Kommunala_jamforelsetal/Grundskola/Skolor_och_elever/Grundskola_skolor_elever.px",
    query: (city) => [
      { code: "variable", selection: { filter: "item", values: ["0"] } },
      { code: "level", selection: { filter: "item", values: [city] } },
      ALL_TIME,
    ],
  },
  "upper-units": {
    cachePrefix: "skv-upper-units",
    url: "https://statistikdatabasen.skolverket.se/PxWeb/api/v1/sv/Skolverkets_statistikdatabas/Kommunala_jamforelsetal/Gymnasieskola/Skolor_och_elever/Gymnasieskola_skolor_elever.px",
    query: (city) => [
      { code: "variable", selection: { filter: "item", values: ["9", "10", "11"] } },
      { code: "level", selection: { filter: "item", values: [city] } },
      ALL_TIME,
    ],
  },
};
