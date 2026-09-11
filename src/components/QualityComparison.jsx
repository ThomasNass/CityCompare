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

  const hasBeaches = Boolean(beachesA || beachesB);
  const hasGreen = greenA?.value != null || greenB?.value != null;
  const hasAir = Boolean(airA || airB);
  const hasCare = careA?.primaryCare?.value != null || careB?.primaryCare?.value != null || careA?.specialist?.value != null || careB?.specialist?.value != null;

  if (!hasBeaches && !hasGreen && !hasAir && !hasCare) return null;

  const greenMode = modeFor("green");
  const careMode = modeFor("care");
  const greenYear = latestYear(greenA, greenB);
  const careYear = latestYear(careA?.primaryCare, careB?.primaryCare, careA?.specialist, careB?.specialist);
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
    </>
  );
}
