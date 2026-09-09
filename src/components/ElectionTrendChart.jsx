import { Line } from "react-chartjs-2";
import { useCities } from "../context/city-context.jsx";

const PARTY_COLORS = {
  M: "#1eaed6",
  C: "#57b557",
  L: "#0084ff",
  KD: "#00284d",
  MP: "#004d0e",
  S: "#ff2403",
  V: "#8a1503",
  SD: "#fffb00",
  ÖVRIGA: "#b0aeae",
};

export default function ElectionTrendChart({ dataKey }) {
  const { city1, city2 } = useCities();

  return (
    <div className="pie-div">
      <ElectionCityTrend city={city1} dataKey={dataKey} />
      <ElectionCityTrend city={city2} dataKey={dataKey} />
    </div>
  );
}

function ElectionCityTrend({ city, dataKey }) {
  const election = city[dataKey];
  if (!election?.years?.length) {
    return <h2>Gick ej att hämta data</h2>;
  }

  const parties = election.parties;
  return (
    <div className="pie-chart">
      <h2>{city.name}</h2>
      <Line
        data={{
          labels: election.years,
          datasets: parties.map((party) => ({
            label: party,
            borderColor: PARTY_COLORS[party] ?? "#64748b",
            backgroundColor: PARTY_COLORS[party] ?? "#64748b",
            borderWidth: 2,
            tension: 0.25,
            pointRadius: 2,
            data: election.years.map((year) => {
              const snapshot = election.byYear[year];
              const index = snapshot.parties.indexOf(party);
              return index >= 0 ? snapshot.share[index] : null;
            }),
          })),
        }}
        options={{
          plugins: { legend: { position: "bottom" } },
          scales: { y: { title: { display: true, text: "%" } } },
        }}
      />
    </div>
  );
}
