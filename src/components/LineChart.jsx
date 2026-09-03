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
              backgroundColor: "pink",
              borderColor: "pink",
              data: city1.population.growth.population,
            },
            {
              label: city2.name,
              backgroundColor: "red",
              borderColor: "red",
              data: city2.population.growth.population,
            },
          ],
        }}
      />
    </div>
  );
}
