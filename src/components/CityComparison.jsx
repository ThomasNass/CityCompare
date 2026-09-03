import { useState } from "react";
import FilterableTable from "./FilterableTable.jsx";
import PopulationBarChart from "./PopulationBarChart.jsx";
import DisplayTax from "./DisplayTax.jsx";
import LineChart from "./LineChart.jsx";
import PieChart from "./PieChart.jsx";
import ElectionPieChart from "./ElectionPieChart.jsx";
import Jobs from "./Jobs.jsx";
import Button from "./Button.jsx";
import Income from "./Income.jsx";
import HousePrice from "./HousePrice.jsx";

export default function CityComparison() {
  const [showTable, setShowTable] = useState(false);

  return (
    <>
      <div className="bar-wrapper wrapper">
        <h1>Folkmängd 2021</h1>
        <h4>Källa: SCB</h4>
        <div className="bar-div">
          <PopulationBarChart />
        </div>
      </div>
      <div className="pie-wrapper wrapper">
        <h1>Män / Kvinnor 2021</h1>
        <h4>Källa: SCB</h4>
        <div className="pie-div">
          <PieChart city="city1" />
          <PieChart city="city2" />
        </div>
      </div>
      <div className="entries-wrapper wrapper">
        <h1>Befolkningsförändringar</h1>
        <h4>Källa: SCB</h4>
        <div className="entries-div">
          <LineChart />
        </div>
      </div>
      <div className="pie-wrapper wrapper">
        <h1>Riksdagsvalet 2018</h1>
        <h4>Källa: SCB</h4>
        <div className="pie-div">
          <ElectionPieChart city="city1" dataKey="electionData" />
          <ElectionPieChart city="city2" dataKey="electionData" />
        </div>
      </div>
      <div className="pie-wrapper wrapper">
        <h1>Kommunalvalet 2018</h1>
        <h4>Källa: SCB</h4>
        <div className="pie-div">
          <ElectionPieChart city="city1" dataKey="electionMuniData" />
          <ElectionPieChart city="city2" dataKey="electionMuniData" />
        </div>
      </div>
      <div className="tax-wrapper wrapper">
        <h1>Skattesats 2022</h1>
        <h4>Källa: Skatteverket</h4>
        <div className="tax-div">
          <DisplayTax city="city1" />
          <DisplayTax city="city2" />
        </div>
      </div>
      <div className="tax-wrapper wrapper">
        <h1>Snittårsinkomst 2022</h1>
        <h4>Källa: SCB</h4>
        <div className="tax-div">
          <Income city="city1" />
          <Income city="city2" />
        </div>
      </div>
      <div className="tax-wrapper wrapper">
        <h1>Snitthuspriser 2021</h1>
        <h4>Källa: SCB</h4>
        <div className="tax-div">
          <HousePrice city="city1" />
          <HousePrice city="city2" />
        </div>
      </div>
      <div className="job-wrapper wrapper">
        <h1>Lediga jobb</h1>
        <h4>Källa: JobTech</h4>
        <div className="job-div">
          <Jobs city="city1" />
        </div>
        <div className="job-div">
          <Jobs city="city2" />
        </div>
      </div>
      <div className="table-wrapper wrapper">
        <h1>Butiker och företag</h1>
        <h4>Källa: hitta.se</h4>
        <div className="table-div">
          <Button
            id="table-button"
            onClick={() => setShowTable((value) => !value)}
            text={showTable ? "Dölj butiker" : "Visa butiker"}
          />
          {showTable ? <FilterableTable /> : null}
        </div>
      </div>
    </>
  );
}
