import Section from "./Section.jsx";
import SeriesLineChart from "./SeriesLineChart.jsx";
import { useCities } from "../context/city-context.jsx";

function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 1 })} %`;
}

function formatRatio(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 1 });
}

function formatCount(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 0 });
}

function formatMerit(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("sv-SE", { maximumFractionDigits: 1 });
}

function latestYear(...stats) {
  return stats
    .map((stat) => stat?.year)
    .filter(Boolean)
    .sort()
    .at(-1);
}

function totalUnits(municipal, independent) {
  if (municipal == null && independent == null) return null;
  return (municipal ?? 0) + (independent ?? 0);
}

function alignedYears(statA, statB) {
  return [...new Set([...(statA?.series?.year ?? []), ...(statB?.series?.year ?? [])])].sort();
}

function valuesForYears(stat, years) {
  const lookup = Object.fromEntries((stat?.series?.year ?? []).map((year, index) => [year, stat.series.values[index]]));
  return years.map((year) => lookup[year] ?? null);
}

function SchoolTable({ cityA, cityB, rows }) {
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
            <tr key={row.label} className={row.indent ? "school-row-indent" : undefined}>
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

function SchoolChart({ title, statA, statB, cityA, cityB, ySuffix = "" }) {
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

export default function SchoolComparison({ modeFor, setSectionMode }) {
  const { city1, city2 } = useCities();
  const schoolA = city1.school;
  const schoolB = city2.school;
  const preschoolA = schoolA?.preschool;
  const preschoolB = schoolB?.preschool;
  const compulsoryA = schoolA?.compulsory;
  const compulsoryB = schoolB?.compulsory;
  const upperA = schoolA?.upper;
  const upperB = schoolB?.upper;
  const unitsA = city1.upperUnits;
  const unitsB = city2.upperUnits;
  const eduA = city1.education;
  const eduB = city2.education;

  const hasUnits = Boolean(schoolA || schoolB || unitsA || unitsB);
  const hasTeachers = Boolean(schoolA || schoolB);
  const hasGrades = Boolean(compulsoryA || compulsoryB);
  const hasUpper = Boolean(upperA || upperB);
  const hasEducation = Boolean(eduA || eduB);

  if (!hasUnits && !hasTeachers && !hasGrades && !hasUpper && !hasEducation) return null;

  const unitsMode = modeFor("schools");
  const teacherMode = modeFor("teachers");
  const gradeMode = modeFor("grades");
  const upperMode = modeFor("upper");
  const educationMode = modeFor("education");

  const unitYear = latestYear(
    preschoolA?.municipalUnits,
    preschoolB?.municipalUnits,
    compulsoryA?.municipalSchools,
    compulsoryB?.municipalSchools,
    unitsA?.total,
    unitsB?.total
  );
  const teacherYear = latestYear(
    preschoolA?.qualified,
    preschoolB?.qualified,
    compulsoryA?.qualified,
    compulsoryB?.qualified,
    upperA?.qualified,
    upperB?.qualified
  );
  const gradeYear = latestYear(compulsoryA?.merit, compulsoryB?.merit, compulsoryA?.eligible, compulsoryB?.eligible);
  const examYear = latestYear(upperA?.exam, upperB?.exam, upperA?.uniEligible, upperB?.uniEligible, upperA?.uniAfter, upperB?.uniAfter);
  const eduYear = latestYear(eduA, eduB);

  return (
    <>
      {hasUnits ? (
        <Section
          title={unitsMode === "latest" ? `Skolenheter ${unitYear ?? ""}`.trim() : "Skolenheter över tid"}
          source="Källa: Kolada / Skolverket"
          mode={unitsMode}
          onModeChange={(mode) => setSectionMode("schools", mode)}
        >
          <p className="school-note">
            Antal förskolor och grundskolor avser enheter i kommunen. Gymnasieskolor kommer från Skolverkets
            kommunala jämförelsetal. Högskolor redovisas inte per kommun; se övergång till högskola och
            befolkningens utbildningsnivå längre ner.
          </p>
          {unitsMode === "latest" ? (
            <SchoolTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Förskolor totalt",
                  a: formatCount(totalUnits(preschoolA?.municipalUnits?.value, preschoolA?.independentUnits?.value)),
                  b: formatCount(totalUnits(preschoolB?.municipalUnits?.value, preschoolB?.independentUnits?.value)),
                },
                {
                  label: "Kommunala förskolor",
                  indent: true,
                  a: formatCount(preschoolA?.municipalUnits?.value),
                  b: formatCount(preschoolB?.municipalUnits?.value),
                },
                {
                  label: "Fristående förskolor",
                  indent: true,
                  a: formatCount(preschoolA?.independentUnits?.value),
                  b: formatCount(preschoolB?.independentUnits?.value),
                },
                {
                  label: "Grundskolor totalt",
                  a: formatCount(totalUnits(compulsoryA?.municipalSchools?.value, compulsoryA?.independentSchools?.value)),
                  b: formatCount(totalUnits(compulsoryB?.municipalSchools?.value, compulsoryB?.independentSchools?.value)),
                },
                {
                  label: "Kommunala grundskolor",
                  indent: true,
                  a: formatCount(compulsoryA?.municipalSchools?.value),
                  b: formatCount(compulsoryB?.municipalSchools?.value),
                },
                {
                  label: "Fristående grundskolor",
                  indent: true,
                  a: formatCount(compulsoryA?.independentSchools?.value),
                  b: formatCount(compulsoryB?.independentSchools?.value),
                },
                {
                  label: "Gymnasieskolor totalt",
                  a: formatCount(unitsA?.total?.value),
                  b: formatCount(unitsB?.total?.value),
                },
                {
                  label: "Kommunala gymnasieskolor",
                  indent: true,
                  a: formatCount(unitsA?.municipal?.value),
                  b: formatCount(unitsB?.municipal?.value),
                },
                {
                  label: "Fristående gymnasieskolor",
                  indent: true,
                  a: formatCount(unitsA?.independent?.value),
                  b: formatCount(unitsB?.independent?.value),
                },
                {
                  label: "Elever i fristående gymnasium",
                  a: formatPercent(upperA?.independentShare?.value),
                  b: formatPercent(upperB?.independentShare?.value),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              <SchoolChart title="Kommunala förskolor" statA={preschoolA?.municipalUnits} statB={preschoolB?.municipalUnits} cityA={city1} cityB={city2} />
              <SchoolChart title="Fristående förskolor" statA={preschoolA?.independentUnits} statB={preschoolB?.independentUnits} cityA={city1} cityB={city2} />
              <SchoolChart title="Kommunala grundskolor" statA={compulsoryA?.municipalSchools} statB={compulsoryB?.municipalSchools} cityA={city1} cityB={city2} />
              <SchoolChart title="Fristående grundskolor" statA={compulsoryA?.independentSchools} statB={compulsoryB?.independentSchools} cityA={city1} cityB={city2} />
              <SchoolChart title="Gymnasieskolor totalt" statA={unitsA?.total} statB={unitsB?.total} cityA={city1} cityB={city2} />
              <SchoolChart title="Elever i fristående gymnasium" statA={upperA?.independentShare} statB={upperB?.independentShare} cityA={city1} cityB={city2} ySuffix="%" />
            </div>
          )}
        </Section>
      ) : null}

      {hasTeachers ? (
        <Section
          title={teacherMode === "latest" ? `Lärarbehörighet ${teacherYear ?? ""}`.trim() : "Lärarbehörighet över tid"}
          source="Källa: Kolada / Skolverket"
          mode={teacherMode}
          onModeChange={(mode) => setSectionMode("teachers", mode)}
        >
          {teacherMode === "latest" ? (
            <SchoolTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Förskola, legitimerad personal",
                  a: formatPercent(preschoolA?.qualified?.value),
                  b: formatPercent(preschoolB?.qualified?.value),
                },
                {
                  label: "Förskola, barn per årsarbetare",
                  a: formatRatio(preschoolA?.childrenPerStaff?.value),
                  b: formatRatio(preschoolB?.childrenPerStaff?.value),
                },
                {
                  label: "Grundskola, legitimation och behörighet",
                  a: formatPercent(compulsoryA?.qualified?.value),
                  b: formatPercent(compulsoryB?.qualified?.value),
                },
                {
                  label: "Grundskola, elever per lärare",
                  a: formatRatio(compulsoryA?.pupilsPerTeacher?.value),
                  b: formatRatio(compulsoryB?.pupilsPerTeacher?.value),
                },
                {
                  label: "Gymnasium, pedagogisk högskoleexamen",
                  a: formatPercent(upperA?.qualified?.value),
                  b: formatPercent(upperB?.qualified?.value),
                },
                {
                  label: "Gymnasium, elever per lärare",
                  a: formatRatio(upperA?.pupilsPerTeacher?.value),
                  b: formatRatio(upperB?.pupilsPerTeacher?.value),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              <SchoolChart title="Förskola, legitimerad personal" statA={preschoolA?.qualified} statB={preschoolB?.qualified} cityA={city1} cityB={city2} ySuffix="%" />
              <SchoolChart title="Förskola, barn per årsarbetare" statA={preschoolA?.childrenPerStaff} statB={preschoolB?.childrenPerStaff} cityA={city1} cityB={city2} />
              <SchoolChart title="Grundskola, behöriga lärare" statA={compulsoryA?.qualified} statB={compulsoryB?.qualified} cityA={city1} cityB={city2} ySuffix="%" />
              <SchoolChart title="Grundskola, elever per lärare" statA={compulsoryA?.pupilsPerTeacher} statB={compulsoryB?.pupilsPerTeacher} cityA={city1} cityB={city2} />
              <SchoolChart title="Gymnasium, behöriga lärare" statA={upperA?.qualified} statB={upperB?.qualified} cityA={city1} cityB={city2} ySuffix="%" />
              <SchoolChart title="Gymnasium, elever per lärare" statA={upperA?.pupilsPerTeacher} statB={upperB?.pupilsPerTeacher} cityA={city1} cityB={city2} />
            </div>
          )}
        </Section>
      ) : null}

      {hasGrades ? (
        <Section
          title={gradeMode === "latest" ? `Grundskola, betyg ${gradeYear ?? ""}`.trim() : "Grundskola, betyg över tid"}
          source="Källa: Kolada / Skolverket"
          mode={gradeMode}
          onModeChange={(mode) => setSectionMode("grades", mode)}
        >
          {gradeMode === "latest" ? (
            <SchoolTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Meritvärde åk 9, 17 ämnen",
                  a: formatMerit(compulsoryA?.merit?.value),
                  b: formatMerit(compulsoryB?.merit?.value),
                },
                {
                  label: "Behöriga till yrkesprogram, hemkommun",
                  a: formatPercent(compulsoryA?.eligible?.value),
                  b: formatPercent(compulsoryB?.eligible?.value),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              <SchoolChart title="Meritvärde åk 9" statA={compulsoryA?.merit} statB={compulsoryB?.merit} cityA={city1} cityB={city2} />
              <SchoolChart title="Behöriga till yrkesprogram" statA={compulsoryA?.eligible} statB={compulsoryB?.eligible} cityA={city1} cityB={city2} ySuffix="%" />
            </div>
          )}
        </Section>
      ) : null}

      {hasUpper ? (
        <Section
          title={upperMode === "latest" ? `Gymnasieexamen ${examYear ?? ""}`.trim() : "Gymnasieexamen över tid"}
          source="Källa: Kolada / Skolverket"
          mode={upperMode}
          onModeChange={(mode) => setSectionMode("upper", mode)}
        >
          <p className="school-note">
            Examen och högskolebehörighet avser elever folkbokförda i kommunen (hemkommun), inte bara skolor som
            ligger i kommunen.
          </p>
          {upperMode === "latest" ? (
            <SchoolTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Examen inom 3 år, hemkommun",
                  a: formatPercent(upperA?.exam?.value),
                  b: formatPercent(upperB?.exam?.value),
                },
                {
                  label: "Högskolebehörighet inom 3 år",
                  a: formatPercent(upperA?.uniEligible?.value),
                  b: formatPercent(upperB?.uniEligible?.value),
                },
                {
                  label: "På högskola 2 år efter examen",
                  a: formatPercent(upperA?.uniAfter?.value),
                  b: formatPercent(upperB?.uniAfter?.value),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              <SchoolChart title="Gymnasieexamen inom 3 år" statA={upperA?.exam} statB={upperB?.exam} cityA={city1} cityB={city2} ySuffix="%" />
              <SchoolChart title="Högskolebehörighet inom 3 år" statA={upperA?.uniEligible} statB={upperB?.uniEligible} cityA={city1} cityB={city2} ySuffix="%" />
              <SchoolChart title="På högskola 2 år efter examen" statA={upperA?.uniAfter} statB={upperB?.uniAfter} cityA={city1} cityB={city2} ySuffix="%" />
            </div>
          )}
        </Section>
      ) : null}

      {hasEducation ? (
        <Section
          title={educationMode === "latest" ? `Utbildningsnivå ${eduYear ?? ""}`.trim() : "Utbildningsnivå över tid"}
          source="Källa: SCB"
          mode={educationMode}
          onModeChange={(mode) => setSectionMode("education", mode)}
        >
          <p className="school-note">Andel av befolkningen 16–74 år. Uppgift saknas räknas inte med.</p>
          {educationMode === "latest" ? (
            <SchoolTable
              cityA={city1}
              cityB={city2}
              rows={[
                {
                  label: "Förgymnasial utbildning",
                  a: formatPercent(eduA?.preSecondary),
                  b: formatPercent(eduB?.preSecondary),
                },
                {
                  label: "Gymnasial utbildning",
                  a: formatPercent(eduA?.secondary),
                  b: formatPercent(eduB?.secondary),
                },
                {
                  label: "Eftergymnasial utbildning",
                  a: formatPercent(eduA?.postSecondary),
                  b: formatPercent(eduB?.postSecondary),
                },
              ]}
            />
          ) : (
            <div className="series-stack">
              <SchoolChart
                title="Förgymnasial utbildning"
                statA={eduA ? { series: { year: eduA.series?.year, values: eduA.series?.preSecondary } } : null}
                statB={eduB ? { series: { year: eduB.series?.year, values: eduB.series?.preSecondary } } : null}
                cityA={city1}
                cityB={city2}
                ySuffix="%"
              />
              <SchoolChart
                title="Gymnasial utbildning"
                statA={eduA ? { series: { year: eduA.series?.year, values: eduA.series?.secondary } } : null}
                statB={eduB ? { series: { year: eduB.series?.year, values: eduB.series?.secondary } } : null}
                cityA={city1}
                cityB={city2}
                ySuffix="%"
              />
              <SchoolChart
                title="Eftergymnasial utbildning"
                statA={eduA ? { series: { year: eduA.series?.year, values: eduA.series?.postSecondary } } : null}
                statB={eduB ? { series: { year: eduB.series?.year, values: eduB.series?.postSecondary } } : null}
                cityA={city1}
                cityB={city2}
                ySuffix="%"
              />
            </div>
          )}
        </Section>
      ) : null}
    </>
  );
}
