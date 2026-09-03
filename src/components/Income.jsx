import { useCities } from "../context/city-context.jsx";

export default function Income({ city: cityKey }) {
  const city = useCities()[cityKey];

  if (Number.isNaN(Number(city.income?.average)) || Number.isNaN(Number(city.income?.median))) {
    return <p>Inkomster kunde inte hämtas</p>;
  }

  return (
    <div>
      <h2>{city.name}</h2>
      <h2>Medel: {Math.round(city.income.average)} tkr</h2>
      <h2>Median: {Math.round(city.income.median)} tkr</h2>
    </div>
  );
}
