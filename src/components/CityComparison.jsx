import { useState } from "react";
import PopulationBarChart from "./PopulationBarChart.jsx";
import DisplayTax from "./DisplayTax.jsx";
import LineChart from "./LineChart.jsx";
import PieChart from "./PieChart.jsx";
import ElectionPieChart from "./ElectionPieChart.jsx";
import ElectionTrendChart from "./ElectionTrendChart.jsx";
import SeriesLineChart from "./SeriesLineChart.jsx";
import Jobs from "./Jobs.jsx";
import Income from "./Income.jsx";
import HousePrice from "./HousePrice.jsx";
import ViewToggle from "./ViewToggle.jsx";
import Section from "./Section.jsx";
import SchoolComparison from "./SchoolComparison.jsx";
import { useCities } from "../context/city-context.jsx";

export default function CityComparison() {
  const { city1, city2 } = useCities();
  const [globalMode, setGlobalMode] = useState("latest");
  const [overrides, setOverrides] = useState({});

  function modeFor(key) {
    return overrides[key] ?? globalMode;
  }

  function setSectionMode(key, mode) {
    setOverrides((current) => ({ ...current, [key]: mode }));
  }

  function setAll(mode) {
    setGlobalMode(mode);
    setOverrides({});
  }

  const populationMode = modeFor("population");
  const genderMode = modeFor("gender");
  const electionMode = modeFor("election");
  const muniElectionMode = modeFor("electionMuni");
  const taxMode = modeFor("tax");
  const incomeMode = modeFor("income");
  const houseMode = modeFor("house");

  return (
    <div className="results">
      <div className="global-view-bar">
        <p>Visa i alla diagram</p>
        <ViewToggle value={globalMode} onChange={setAll} />
      </div>

      <Section
        title={populationMode === "latest" ? `Folkmängd ${city1.population?.year ?? ""}` : "Folkmängd över tid"}
        source="Källa: SCB"
        mode={populationMode}
        onModeChange={(mode) => setSectionMode("population", mode)}
      >
        {populationMode === "latest" ? (
          <div className="bar-div">
            <PopulationBarChart />
          </div>
        ) : (
          <div className="entries-div">
            <LineChart />
          </div>
        )}
      </Section>

      <Section
        title={genderMode === "latest" ? `Män / Kvinnor ${city1.population?.year ?? ""}` : "Könsfördelning över tid"}
        source="Källa: SCB"
        mode={genderMode}
        onModeChange={(mode) => setSectionMode("gender", mode)}
      >
        {genderMode === "latest" ? (
          <div className="pie-div">
            <PieChart city="city1" />
            <PieChart city="city2" />
          </div>
        ) : (
          <div className="entries-div">
            <SeriesLineChart
              labels={city1.population?.genderSeries?.year ?? []}
              series={[
                { label: `${city1.name} män`, data: city1.population?.genderSeries?.men ?? [], color: "#14b8a6" },
                { label: `${city1.name} kvinnor`, data: city1.population?.genderSeries?.fem ?? [], color: "#0f766e" },
                { label: `${city2.name} män`, data: city2.population?.genderSeries?.men ?? [], color: "#fb7185" },
                { label: `${city2.name} kvinnor`, data: city2.population?.genderSeries?.fem ?? [], color: "#9f1239" },
              ]}
            />
          </div>
        )}
      </Section>

      <Section
        title={electionMode === "latest" ? `Riksdagsvalet ${city1.electionData?.year ?? ""}` : "Riksdagsval över tid"}
        source="Källa: SCB"
        mode={electionMode}
        onModeChange={(mode) => setSectionMode("election", mode)}
      >
        {electionMode === "latest" ? (
          <div className="pie-div">
            <ElectionPieChart city="city1" dataKey="electionData" />
            <ElectionPieChart city="city2" dataKey="electionData" />
          </div>
        ) : (
          <ElectionTrendChart dataKey="electionData" />
        )}
      </Section>

      <Section
        title={
          muniElectionMode === "latest"
            ? `Kommunalvalet ${city1.electionMuniData?.year ?? ""}`
            : "Kommunalval över tid"
        }
        source="Källa: SCB"
        mode={muniElectionMode}
        onModeChange={(mode) => setSectionMode("electionMuni", mode)}
      >
        {muniElectionMode === "latest" ? (
          <div className="pie-div">
            <ElectionPieChart city="city1" dataKey="electionMuniData" />
            <ElectionPieChart city="city2" dataKey="electionMuniData" />
          </div>
        ) : (
          <ElectionTrendChart dataKey="electionMuniData" />
        )}
      </Section>

      <Section
        title={taxMode === "latest" ? `Skattesats ${city1.taxYear ?? ""}` : "Skattesats över tid"}
        source="Källa: Skatteverket"
        mode={taxMode}
        onModeChange={(mode) => setSectionMode("tax", mode)}
      >
        {taxMode === "latest" ? (
          <div className="tax-div">
            <DisplayTax city="city1" />
            <DisplayTax city="city2" />
          </div>
        ) : (
          <div className="entries-div">
            <SeriesLineChart
              labels={city1.taxSeries?.year ?? []}
              series={[
                { label: city1.name, data: city1.taxSeries?.values ?? [] },
                { label: city2.name, data: city2.taxSeries?.values ?? [] },
              ]}
              ySuffix="%"
            />
          </div>
        )}
      </Section>

      <Section
        title={incomeMode === "latest" ? `Snittårsinkomst ${city1.income?.year ?? ""}` : "Inkomst över tid"}
        source="Källa: SCB"
        mode={incomeMode}
        onModeChange={(mode) => setSectionMode("income", mode)}
      >
        {incomeMode === "latest" ? (
          <div className="tax-div">
            <Income city="city1" />
            <Income city="city2" />
          </div>
        ) : (
          <div className="entries-div">
            <SeriesLineChart
              labels={city1.income?.series?.year ?? []}
              series={[
                { label: `${city1.name} medel`, data: city1.income?.series?.average ?? [], color: "#14b8a6" },
                { label: `${city1.name} median`, data: city1.income?.series?.median ?? [], color: "#0f766e" },
                { label: `${city2.name} medel`, data: city2.income?.series?.average ?? [], color: "#fb7185" },
                { label: `${city2.name} median`, data: city2.income?.series?.median ?? [], color: "#9f1239" },
              ]}
              ySuffix="tkr"
            />
          </div>
        )}
      </Section>

      <Section
        title={houseMode === "latest" ? `Snitthuspriser ${city1.housePriceYear ?? ""}` : "Huspriser över tid"}
        source="Källa: SCB"
        mode={houseMode}
        onModeChange={(mode) => setSectionMode("house", mode)}
      >
        {houseMode === "latest" ? (
          <div className="tax-div">
            <HousePrice city="city1" />
            <HousePrice city="city2" />
          </div>
        ) : (
          <div className="entries-div">
            <SeriesLineChart
              labels={city1.housePriceSeries?.year ?? []}
              series={[
                { label: city1.name, data: city1.housePriceSeries?.values ?? [] },
                { label: city2.name, data: city2.housePriceSeries?.values ?? [] },
              ]}
              ySuffix="tkr"
            />
          </div>
        )}
      </Section>

      <SchoolComparison modeFor={modeFor} setSectionMode={setSectionMode} />

      <Section title="Lediga jobb" source="Källa: JobTech" className="job-wrapper">
        <div className="job-div">
          <Jobs city="city1" />
        </div>
        <div className="job-div">
          <Jobs city="city2" />
        </div>
      </Section>
    </div>
  );
}
