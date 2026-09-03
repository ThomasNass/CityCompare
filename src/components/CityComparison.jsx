import PopulationBarChart from "./PopulationBarChart.jsx";
import DisplayTax from "./DisplayTax.jsx";
import LineChart from "./LineChart.jsx";
import PieChart from "./PieChart.jsx";
import ElectionPieChart from "./ElectionPieChart.jsx";
import Jobs from "./Jobs.jsx";
import Income from "./Income.jsx";
import HousePrice from "./HousePrice.jsx";

function Section({ title, source, children, className = "" }) {
  return (
    <section className={`wrapper ${className}`}>
      <div className="card-header">
        <h1>{title}</h1>
        <p className="card-source">{source}</p>
      </div>
      {children}
    </section>
  );
}

export default function CityComparison() {
  return (
    <div className="results">
      <Section title="Folkmängd 2021" source="Källa: SCB">
        <div className="bar-div">
          <PopulationBarChart />
        </div>
      </Section>
      <Section title="Män / Kvinnor 2021" source="Källa: SCB">
        <div className="pie-div">
          <PieChart city="city1" />
          <PieChart city="city2" />
        </div>
      </Section>
      <Section title="Befolkningsförändringar" source="Källa: SCB">
        <div className="entries-div">
          <LineChart />
        </div>
      </Section>
      <Section title="Riksdagsvalet 2018" source="Källa: SCB">
        <div className="pie-div">
          <ElectionPieChart city="city1" dataKey="electionData" />
          <ElectionPieChart city="city2" dataKey="electionData" />
        </div>
      </Section>
      <Section title="Kommunalvalet 2018" source="Källa: SCB">
        <div className="pie-div">
          <ElectionPieChart city="city1" dataKey="electionMuniData" />
          <ElectionPieChart city="city2" dataKey="electionMuniData" />
        </div>
      </Section>
      <Section title="Skattesats 2022" source="Källa: Skatteverket">
        <div className="tax-div">
          <DisplayTax city="city1" />
          <DisplayTax city="city2" />
        </div>
      </Section>
      <Section title="Snittårsinkomst 2020" source="Källa: SCB">
        <div className="tax-div">
          <Income city="city1" />
          <Income city="city2" />
        </div>
      </Section>
      <Section title="Snitthuspriser 2021" source="Källa: SCB">
        <div className="tax-div">
          <HousePrice city="city1" />
          <HousePrice city="city2" />
        </div>
      </Section>
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
