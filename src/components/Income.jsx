import { useCities } from "../context/city-context.jsx";

export default function Income({ city: cityKey }) {
  const city = useCities()[cityKey];

  if (Number.isNaN(Number(city.income?.average)) || Number.isNaN(Number(city.income?.median))) {
    return <p>Inkomster kunde inte hämtas</p>;
  }

  return (
    <div className="stat-card">
      <p className="stat-label">{city.name}</p>
      <p className="stat-value">{Math.round(city.income.average)} tkr</p>
      <p className="stat-sub">Median {Math.round(city.income.median)} tkr</p>
    </div>
  );
}
