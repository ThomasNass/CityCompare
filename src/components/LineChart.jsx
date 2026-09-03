import { Line } from "react-chartjs-2";
import { useCities } from "../context/city-context.jsx";

export default function LineChart() {
  const { city1, city2 } = useCities();

  if (!("growth" in city1.population) || !("growth" in city2.population)) {
    return <p>Gick ej att hämta populationsförändringar</p>;
  }

  return (
    <div className="line-chart">
      <Line
        data={{
          labels: city1.population.growth.year,
          datasets: [
            {
              label: city1.name,
              backgroundColor: "rgba(20, 184, 166, 0.18)",
              borderColor: "#14b8a6",
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 2,
              data: city1.population.growth.population,
            },
            {
              label: city2.name,
              backgroundColor: "rgba(251, 113, 133, 0.18)",
              borderColor: "#fb7185",
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 2,
              data: city2.population.growth.population,
            },
          ],
        }}
      />
    </div>
  );
}
