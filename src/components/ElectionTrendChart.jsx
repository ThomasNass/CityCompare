import { Line } from "react-chartjs-2";
import { useCities } from "../context/city-context.jsx";
import { partyColor } from "../lib/parties.js";

export default function ElectionTrendChart({ dataKey }) {
  const { city1, city2 } = useCities();

  return (
    <div className="election-trend-stack">
      <ElectionCityTrend city={city1} dataKey={dataKey} />
      <ElectionCityTrend city={city2} dataKey={dataKey} />
    </div>
  );
}

function ElectionCityTrend({ city, dataKey }) {
  const election = city[dataKey];
  if (!election?.years?.length) {
    return <p className="election-empty">Gick ej att hämta data</p>;
  }

  const parties = election.parties;
  return (
    <div className="election-trend-chart">
      <h2>{city.name}</h2>
      <div className="election-trend-canvas">
        <Line
          data={{
            labels: election.years,
            datasets: parties.map((party) => ({
              label: party,
              borderColor: partyColor(party),
              backgroundColor: partyColor(party),
              borderWidth: 2.5,
              tension: 0.2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: false,
              spanGaps: true,
              data: election.years.map((year) => {
                const snapshot = election.byYear[year];
                const index = snapshot?.parties.indexOf(party) ?? -1;
                return index >= 0 ? snapshot.share[index] : null;
              }),
            })),
          }}
          options={{
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, pointStyle: "circle", padding: 16 },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { callback: (value) => `${value} %` },
                grid: { color: "rgba(15, 23, 42, 0.06)" },
              },
              x: {
                grid: { display: false },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
