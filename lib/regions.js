export const COUNTIES = {
  "01": { regionId: "0001", name: "Region Stockholm", seat: { lau: "0180", name: "Stockholm" } },
  "03": { regionId: "0003", name: "Region Uppsala", seat: { lau: "0380", name: "Uppsala" } },
  "04": { regionId: "0004", name: "Region Sörmland", seat: { lau: "0480", name: "Nyköping" } },
  "05": { regionId: "0005", name: "Region Östergötland", seat: { lau: "0580", name: "Linköping" } },
  "06": { regionId: "0006", name: "Region Jönköpings län", seat: { lau: "0680", name: "Jönköping" } },
  "07": { regionId: "0007", name: "Region Kronoberg", seat: { lau: "0780", name: "Växjö" } },
  "08": { regionId: "0008", name: "Region Kalmar län", seat: { lau: "0880", name: "Kalmar" } },
  "09": { regionId: "0009", name: "Region Gotland", seat: { lau: "0980", name: "Gotland" } },
  "10": { regionId: "0010", name: "Region Blekinge", seat: { lau: "1080", name: "Karlskrona" } },
  "12": { regionId: "0012", name: "Region Skåne", seat: { lau: "1280", name: "Malmö" } },
  "13": { regionId: "0013", name: "Region Halland", seat: { lau: "1380", name: "Halmstad" } },
  "14": { regionId: "0014", name: "Västra Götalandsregionen", seat: { lau: "1480", name: "Göteborg" } },
  "17": { regionId: "0017", name: "Region Värmland", seat: { lau: "1780", name: "Karlstad" } },
  "18": { regionId: "0018", name: "Region Örebro län", seat: { lau: "1880", name: "Örebro" } },
  "19": { regionId: "0019", name: "Region Västmanland", seat: { lau: "1980", name: "Västerås" } },
  "20": { regionId: "0020", name: "Region Dalarna", seat: { lau: "2080", name: "Falun" } },
  "21": { regionId: "0021", name: "Region Gävleborg", seat: { lau: "2180", name: "Gävle" } },
  "22": { regionId: "0022", name: "Region Västernorrland", seat: { lau: "2280", name: "Härnösand" } },
  "23": { regionId: "0023", name: "Region Jämtland Härjedalen", seat: { lau: "2380", name: "Östersund" } },
  "24": { regionId: "0024", name: "Region Västerbotten", seat: { lau: "2480", name: "Umeå" } },
  "25": { regionId: "0025", name: "Region Norrbotten", seat: { lau: "2580", name: "Luleå" } },
};

export function countyCodeFromLau(lau) {
  return String(lau).padStart(4, "0").slice(0, 2);
}

export function regionFromLau(lau) {
  return COUNTIES[countyCodeFromLau(lau)] ?? null;
}
