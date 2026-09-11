import Section from "./Section.jsx";
import SeriesLineChart from "./SeriesLineChart.jsx";
import { useCities } from "../context/city-context.jsx";

function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 1 })} %`;
}

function formatCount(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 0 });
}

function formatUg(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 1 })} µg/m³`;
}

function formatPer100k(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 0 })} per 100 000`;
}

function hasValue(...stats) {
  return stats.some((stat) => stat?.value != null);
}

function withYear(formatted, stat, other) {
  if (formatted === "—" || !stat?.year) return formatted;
  if (other?.year && other.year !== stat.year) return `${formatted} (${stat.year})`;
  return formatted;
}

function latestYear(...stats) {
  return stats
    .map((stat) => stat?.year)
    .filter(Boolean)
    .sort()
    .at(-1);
}

function alignedYears(statA, statB) {
  return [...new Set([...(statA?.series?.year ?? []), ...(statB?.series?.year ?? [])])].sort();
}

function valuesForYears(stat, years) {
  const lookup = Object.fromEntries((stat?.series?.year ?? []).map((year, index) => [year, stat.series.values[index]]));
  return years.map((year) => lookup[year] ?? null);
}

function StatChart({ title, statA, statB, cityA, cityB, ySuffix = "" }) {
  const years = alignedYears(statA, statB);
  if (!years.length) return null;
  return (
    <div className="school-chart">
      <h2>{title}</h2>
      <SeriesLineChart
        labels={years}
        series={[
          { label: cityA.name, data: valuesForYears(statA, years) },
          { label: cityB.name, data: valuesForYears(statB, years) },
        ]}
        ySuffix={ySuffix}
      />
    </div>
  );
}

function CompareTable({ cityA, cityB, rows }) {
  return (
    <div className="table-div">
      <table className="school-table">
        <thead>
          <tr>
            <th>Mått</th>
            <th>{cityA.name}</th>
            <th>{cityB.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.a}</td>
              <td>{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function airLabel(air) {
  if (!air || air.missing) return "Mätstation saknas";
  const pollutant = air.pollutant === "no2" ? "NO₂" : "PM10";
  const when = air.observedAt
    ? new Date(air.observedAt).toLocaleString("sv-SE", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })
    : "";
  const station = air.station ? ` (${air.station}${when ? `, ${when}` : ""})` : "";
  return `${pollutant} ${formatUg(air.value)}${station}`;
}

export default function QualityComparison({ modeFor, setSectionMode }) {
  const { city1, city2 } = useCities();
  const beachesA = city1.beaches;
  const beachesB = city2.beaches;
  const greenA = city1.green;
  const greenB = city2.green;
  const airA = city1.air;
  const airB = city2.air;
  const careA = city1.care;
  const careB = city2.care;
  const unemploymentA = city1.unemployment;
  const unemploymentB = city2.unemployment;
  const crimeA = city1.crime;
  const crimeB = city2.crime;
  const safetyA = city1.safety;
  const safetyB = city2.safety;

  const hasBeaches = Boolean(beachesA || beachesB);
  const hasGreen = greenA?.value != null || greenB?.value != null;
  const hasAir = Boolean(airA || airB);
  const hasCare = careA?.primaryCare?.value != null || careB?.primaryCare?.value != null || careA?.specialist?.value != null || careB?.specialist?.value != null;
  const hasUnemployment = hasValue(unemploymentA, unemploymentB);
  const hasCrime = hasValue(
    crimeA?.violence,
    crimeB?.violence,
    crimeA?.vandalism,
    crimeB?.vandalism,
    crimeA?.burglary,
    crimeB?.burglary,
    crimeA?.theft,
    crimeB?.theft,
    crimeA?.traffic,
    crimeB?.traffic,
  );
  const hasSafety = hasValue(
    safetyA?.darkOutdoors,
    safetyB?.darkOutdoors,
    safetyA?.burglaryTheft,
    safetyB?.burglaryTheft,
    safetyA?.disturbingTraffic,
    safetyB?.disturbingTraffic,
  );
  const hasCrimeSafety = hasCrime || hasSafety;

  if (!hasBeaches && !hasGreen && !hasAir && !hasCare && !hasUnemployment && !hasCrimeSafety) return null;

  const greenMode = modeFor("green");
  const careMode = modeFor("care");
  const unemploymentMode = modeFor("unemployment");
  const crimeMode = modeFor("crime");
  const greenYear = latestYear(greenA, greenB);
  const careYear = latestYear(careA?.primaryCare, careB?.primaryCare, careA?.specialist, careB?.specialist);
  const unemploymentYear = latestYear(unemploymentA, unemploymentB);
  const crimeYear = latestYear(
    crimeA?.violence,
    crimeB?.violence,
    crimeA?.vandalism,
    crimeB?.vandalism,
    crimeA?.burglary,
    crimeB?.burglary,
    crimeA?.theft,
    crimeB?.theft,
    crimeA?.traffic,
    crimeB?.traffic,
    safetyA?.darkOutdoors,
    safetyB?.darkOutdoors,
    safetyA?.burglaryTheft,
    safetyB?.burglaryTheft,
    safetyA?.disturbingTraffic,
    safetyB?.disturbingTraffic,
  );
  const greenYears = alignedYears(greenA, greenB);
  const carePrimaryYears = alignedYears(careA?.primaryCare, careB?.primaryCare);
  const careSpecYears = alignedYears(careA?.specialist, careB?.specialist);

  return (
    <>
      {hasBeaches ? (
        <Section title="Badplatser" source="Källa: Havs- och vattenmyndigheten">
          <p className="school-note">
            Antal registrerade badplatser i kommunen och andel med EU-klassningen utmärkt badvattenkvalitet.
          </p>
          <CompareTable
            cityA={city1}
            cityB={city2}
            rows={[
              {
                label: "Badplatser totalt",
                a: formatCount(beachesA?.total),
                b: formatCount(beachesB?.total),
              },
              {
                label: "Andel med utmärkt vattenkvalitet",
                a: formatPercent(beachesA?.excellentShare),
                b: formatPercent(beachesB?.excellentShare),
              },
            ]}
          />
        </Section>
      ) : null}

      {hasGreen ? (
        <Section
          title={greenMode === "latest" ? `Grönområden ${greenYear ?? ""}`.trim() : "Grönområden över tid"}
          source="Källa: SCB"
          mode={greenMode}
          onModeChange={(mode) => setSectionMode("green", mode)}
        >
          <p className="school-note">
            Andel av tätortsbefolkningen med grönområde inom 200 meter från bostaden. SCB publicerar måttet vart femte år;
            senaste året är 2020.
          </p>
          {greenMode === "latest" ? (
            <CompareTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Nära grönområde, under 200 m",
                  a: formatPercent(greenA?.value),
                  b: formatPercent(greenB?.value),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              {greenYears.length ? (
                <SeriesLineChart
                  labels={greenYears}
                  series={[
                    { label: city1.name, data: valuesForYears(greenA, greenYears) },
                    { label: city2.name, data: valuesForYears(greenB, greenYears) },
                  ]}
                  ySuffix="%"
                />
              ) : null}
            </div>
          )}
        </Section>
      ) : null}

      {hasAir ? (
        <Section title="Luftkvalitet" source="Källa: Naturvårdsverket / SMHI datavärd luft">
          <p className="school-note">
            Senaste timmens mätning av PM10 eller NO₂. Saknas station i kommunen visas länets centralort, annars att
            mätstation saknas.
          </p>
          <CompareTable
            cityA={city1}
            cityB={city2}
            rows={[
              {
                label: "Senaste mätningen",
                a: airLabel(airA),
                b: airLabel(airB),
              },
              {
                label: "Station",
                a: airA?.missing
                  ? "Mätstation saknas"
                  : airA?.fallback
                    ? `${airA.station} (${airA.fallbackName})`
                    : airA?.station ?? "—",
                b: airB?.missing
                  ? "Mätstation saknas"
                  : airB?.fallback
                    ? `${airB.station} (${airB.fallbackName})`
                    : airB?.station ?? "—",
              },
            ]}
          />
        </Section>
      ) : null}

      {hasCare ? (
        <Section
          title={careMode === "latest" ? `Vårdgaranti ${careYear ?? ""}`.trim() : "Vårdgaranti över tid"}
          source="Källa: Kolada / SKR"
          mode={careMode}
          onModeChange={(mode) => setSectionMode("care", mode)}
        >
          <p className="school-note">
            Sjukvård styrs av regionen, inte kommunen. Siffrorna gäller{" "}
            {careA?.regionName && careB?.regionName && careA.regionName === careB.regionName
              ? careA.regionName
              : [careA?.regionName, careB?.regionName].filter(Boolean).join(" och ")}
            : medicinsk bedömning i primärvården inom tre dagar, samt operation/åtgärd i specialiserad vård inom 90
            dagar.
          </p>
          {careMode === "latest" ? (
            <CompareTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Bedömning på vårdcentral inom 3 dagar",
                  a: formatPercent(careA?.primaryCare?.value),
                  b: formatPercent(careB?.primaryCare?.value),
                },
                {
                  label: "Operation/åtgärd inom 90 dagar",
                  a: formatPercent(careA?.specialist?.value),
                  b: formatPercent(careB?.specialist?.value),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              {carePrimaryYears.length ? (
                <div className="school-chart">
                  <h2>Bedömning inom 3 dagar</h2>
                  <SeriesLineChart
                    labels={carePrimaryYears}
                    series={[
                      { label: city1.name, data: valuesForYears(careA?.primaryCare, carePrimaryYears) },
                      { label: city2.name, data: valuesForYears(careB?.primaryCare, carePrimaryYears) },
                    ]}
                    ySuffix="%"
                  />
                </div>
              ) : null}
              {careSpecYears.length ? (
                <div className="school-chart">
                  <h2>Operation/åtgärd inom 90 dagar</h2>
                  <SeriesLineChart
                    labels={careSpecYears}
                    series={[
                      { label: city1.name, data: valuesForYears(careA?.specialist, careSpecYears) },
                      { label: city2.name, data: valuesForYears(careB?.specialist, careSpecYears) },
                    ]}
                    ySuffix="%"
                  />
                </div>
              ) : null}
            </div>
          )}
        </Section>
      ) : null}

      {hasUnemployment ? (
        <Section
          title={unemploymentMode === "latest" ? `Arbetslöshet ${unemploymentYear ?? ""}`.trim() : "Arbetslöshet över tid"}
          source="Källa: Kolada / Arbetsförmedlingen (BAS)"
          mode={unemploymentMode}
          onModeChange={(mode) => setSectionMode("unemployment", mode)}
        >
          <p className="school-note">
            Andel arbetslösa av befolkningen 20–64 år enligt SCB:s BAS. Senaste tillgängliga helårsdata.
          </p>
          {unemploymentMode === "latest" ? (
            <CompareTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Arbetslösa, 20–64 år",
                  a: withYear(formatPercent(unemploymentA?.value), unemploymentA, unemploymentB),
                  b: withYear(formatPercent(unemploymentB?.value), unemploymentB, unemploymentA),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              <StatChart
                title="Arbetslösa, 20–64 år"
                statA={unemploymentA}
                statB={unemploymentB}
                cityA={city1}
                cityB={city2}
                ySuffix="%"
              />
            </div>
          )}
        </Section>
      ) : null}

      {hasCrimeSafety ? (
        <Section
          title={crimeMode === "latest" ? `Brott och trygghet ${crimeYear ?? ""}`.trim() : "Brott och trygghet över tid"}
          source="Källa: Kolada / Brå och SCB Medborgarundersökning"
          mode={crimeMode}
          onModeChange={(mode) => setSectionMode("crime", mode)}
        >
          <p className="school-note">
            Anmälda brott redovisas per 100 000 invånare (Brå). Trygghet kommer från SCB:s medborgarundersökning och
            visar andelen som känner sig trygga eller upplever få problem. Alla kommuner deltar inte varje år; saknas
            senaste året visas senaste tillgängliga värde.
          </p>
          {crimeMode === "latest" ? (
            <>
              {hasCrime ? (
                <>
                  <h2 className="school-subgroup">Anmälda brott</h2>
                  <CompareTable
                    cityA={city1}
                    cityB={city2}
                    rows={[
                      {
                        label: "Våldsbrott",
                        a: withYear(formatPer100k(crimeA?.violence?.value), crimeA?.violence, crimeB?.violence),
                        b: withYear(formatPer100k(crimeB?.violence?.value), crimeB?.violence, crimeA?.violence),
                      },
                      {
                        label: "Skadegörelse",
                        a: withYear(formatPer100k(crimeA?.vandalism?.value), crimeA?.vandalism, crimeB?.vandalism),
                        b: withYear(formatPer100k(crimeB?.vandalism?.value), crimeB?.vandalism, crimeA?.vandalism),
                      },
                      {
                        label: "Bostadsinbrott",
                        a: withYear(formatPer100k(crimeA?.burglary?.value), crimeA?.burglary, crimeB?.burglary),
                        b: withYear(formatPer100k(crimeB?.burglary?.value), crimeB?.burglary, crimeA?.burglary),
                      },
                      {
                        label: "Stöld- och tillgreppsbrott",
                        a: withYear(formatPer100k(crimeA?.theft?.value), crimeA?.theft, crimeB?.theft),
                        b: withYear(formatPer100k(crimeB?.theft?.value), crimeB?.theft, crimeA?.theft),
                      },
                      {
                        label: "Trafikbrott",
                        a: withYear(formatPer100k(crimeA?.traffic?.value), crimeA?.traffic, crimeB?.traffic),
                        b: withYear(formatPer100k(crimeB?.traffic?.value), crimeB?.traffic, crimeA?.traffic),
                      },
                    ]}
                  />
                </>
              ) : null}
              {hasSafety ? (
                <>
                  <h2 className="school-subgroup">Upplevd trygghet</h2>
                  <CompareTable
                    cityA={city1}
                    cityB={city2}
                    rows={[
                      {
                        label: "Trygg utomhus när det är mörkt",
                        a: withYear(formatPercent(safetyA?.darkOutdoors?.value), safetyA?.darkOutdoors, safetyB?.darkOutdoors),
                        b: withYear(formatPercent(safetyB?.darkOutdoors?.value), safetyB?.darkOutdoors, safetyA?.darkOutdoors),
                      },
                      {
                        label: "Få problem med inbrott eller stölder",
                        a: withYear(formatPercent(safetyA?.burglaryTheft?.value), safetyA?.burglaryTheft, safetyB?.burglaryTheft),
                        b: withYear(formatPercent(safetyB?.burglaryTheft?.value), safetyB?.burglaryTheft, safetyA?.burglaryTheft),
                      },
                      {
                        label: "Få problem med störande trafik",
                        a: withYear(
                          formatPercent(safetyA?.disturbingTraffic?.value),
                          safetyA?.disturbingTraffic,
                          safetyB?.disturbingTraffic,
                        ),
                        b: withYear(
                          formatPercent(safetyB?.disturbingTraffic?.value),
                          safetyB?.disturbingTraffic,
                          safetyA?.disturbingTraffic,
                        ),
                      },
                    ]}
                  />
                </>
              ) : null}
            </>
          ) : (
            <div className="series-stack">
              {hasCrime ? (
                <>
                  <h2 className="school-subgroup">Anmälda brott</h2>
                  <StatChart title="Våldsbrott" statA={crimeA?.violence} statB={crimeB?.violence} cityA={city1} cityB={city2} />
                  <StatChart title="Skadegörelse" statA={crimeA?.vandalism} statB={crimeB?.vandalism} cityA={city1} cityB={city2} />
                  <StatChart title="Bostadsinbrott" statA={crimeA?.burglary} statB={crimeB?.burglary} cityA={city1} cityB={city2} />
                  <StatChart
                    title="Stöld- och tillgreppsbrott"
                    statA={crimeA?.theft}
                    statB={crimeB?.theft}
                    cityA={city1}
                    cityB={city2}
                  />
                  <StatChart title="Trafikbrott" statA={crimeA?.traffic} statB={crimeB?.traffic} cityA={city1} cityB={city2} />
                </>
              ) : null}
              {hasSafety ? (
                <>
                  <h2 className="school-subgroup">Upplevd trygghet</h2>
                  <StatChart
                    title="Trygg utomhus när det är mörkt"
                    statA={safetyA?.darkOutdoors}
                    statB={safetyB?.darkOutdoors}
                    cityA={city1}
                    cityB={city2}
                    ySuffix="%"
                  />
                  <StatChart
                    title="Få problem med inbrott eller stölder"
                    statA={safetyA?.burglaryTheft}
                    statB={safetyB?.burglaryTheft}
                    cityA={city1}
                    cityB={city2}
                    ySuffix="%"
                  />
                  <StatChart
                    title="Få problem med störande trafik"
                    statA={safetyA?.disturbingTraffic}
                    statB={safetyB?.disturbingTraffic}
                    cityA={city1}
                    cityB={city2}
                    ySuffix="%"
                  />
                </>
              ) : null}
            </div>
          )}
        </Section>
      ) : null}
    </>
  );
}
