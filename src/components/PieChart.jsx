import { Pie } from "react-chartjs-2";
import { useCities } from "../context/city-context.jsx";

export default function PieChart({ city: cityKey }) {
  const city = useCities()[cityKey];
  const hasPopulation = city.population.men > 0 || city.population.fem > 0;
  const menPercent = hasPopulation
    ? Math.round((city.population.men / city.population.total) * 100)
    : 0;
  const womenPercent = hasPopulation
    ? Math.round((city.population.fem / city.population.total) * 100)
    : 0;

  return (
    <div className="pie-chart">
      <h2>{city.name}</h2>
      {hasPopulation ? (
        <Pie
          data={{
            labels: [`Män ${menPercent}%`, `Kvinnor ${womenPercent}%`],
            datasets: [
              {
                backgroundColor: ["red", "pink"],
                data: [city.population.men, city.population.fem],
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
