import { Bar } from "react-chartjs-2";
import { useCities } from "../context/city-context.jsx";

export default function PopulationBarChart() {
  const { city1, city2 } = useCities();

  if (Number.isNaN(city1.population.total) || Number.isNaN(city2.population.total)) {
    return <p>Kunde inte hämta populationsdata</p>;
  }

  return (
    <Bar
      data={{
        labels: [city1.name, city2.name],
        datasets: [
          {
            label: "Folkmängd",
            backgroundColor: "pink",
            data: [city1.population.total, city2.population.total],
          },
        ],
      }}
    />
  );
}
