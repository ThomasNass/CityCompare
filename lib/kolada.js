export const KOLADA_KPIS = {
  preschoolQualified: "N11808",
  preschoolChildrenPerStaff: "N11102",
  preschoolMunicipal: "N11061",
  preschoolIndependent: "N11060",
  compulsoryQualified: "N15813",
  compulsoryPupilsPerTeacher: "N15033",
  compulsoryMerit: "N15504",
  compulsoryEligible: "N15428",
  compulsoryMunicipalSchools: "N15750",
  compulsoryIndependentSchools: "N15751",
  upperQualified: "N17825",
  upperPupilsPerTeacher: "N17816",
  upperExam: "N17445",
  upperUniEligible: "N17473",
  upperUniAfter: "N18605",
  upperIndependentShare: "N17897",
};

export const KOLADA_KPI_IDS = Object.values(KOLADA_KPIS);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchKoladaCity(city, { retries = 3 } = {}) {
  const municipality = String(city).padStart(4, "0");
  const startUrl = `https://api.kolada.se/v3/data/kpi/${KOLADA_KPI_IDS.join(",")}/municipality/${municipality}`;
  let lastStatus = 502;
  let lastBody = { error: "Kolada-anropet misslyckades" };

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const values = [];
      let next = startUrl;
      let incomplete = false;

      while (next) {
        const response = await fetch(next, {
          headers: { Accept: "application/json" },
        });
        lastStatus = response.status;
        const data = await response.json().catch(() => null);
        lastBody = data ?? { error: "Kolada-anropet misslyckades" };
        const retryable = response.status === 429 || response.status >= 500 || !data;

        if (!response.ok || !data) {
          if (retryable && attempt < retries - 1) {
            incomplete = true;
            await sleep(400 * 2 ** attempt);
            break;
          }
          return { status: response.status || 502, data: lastBody };
        }

        values.push(...(data.values ?? []));
        next = data.next_url || null;
      }

      if (!incomplete) {
        return { status: 200, data: { values } };
      }
    } catch (error) {
      lastStatus = 502;
      lastBody = { error: error.message || "Kolada-anropet misslyckades" };
      if (attempt < retries - 1) await sleep(400 * 2 ** attempt);
    }
  }

  return { status: lastStatus, data: lastBody };
}
