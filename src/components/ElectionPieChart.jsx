import { Pie } from "react-chartjs-2";
import { useCities } from "../context/city-context.jsx";

export default function ElectionPieChart({ city: cityKey, dataKey }) {
  const city = useCities()[cityKey];
  const electionData = city[dataKey];

  return (
    <div className="pie-chart">
      <h2>{city.name}</h2>
      {"parties" in electionData ? (
        <Pie
          data={{
            labels: electionData.parties,
            datasets: [
              {
                backgroundColor: [
                  "#1eaed6",
                  "#57b557",
                  "#0084ff",
                  "#00284d",
                  "#004d0e",
                  "#ff2403",
                  "#8a1503",
                  "#fffb00",
                  "#b0aeae",
                ],
                data: electionData.share,
                borderWidth: 0,
              },
            ],
          }}
        />
      ) : (
        <h2>Gick ej att hämta data</h2>
      )}
    </div>
  );
}
