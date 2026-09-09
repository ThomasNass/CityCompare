import { useCities } from "../context/city-context.jsx";

export default function Income({ city: cityKey }) {
  const city = useCities()[cityKey];
  const average = Number(city.income?.average);
  const median = Number(city.income?.median);

  if (!Number.isFinite(average) || !Number.isFinite(median)) {
    return <p>Inkomster kunde inte hämtas</p>;
  }

  return (
    <div className="stat-card">
      <p className="stat-label">{city.name}</p>
      <p className="stat-value">{Math.round(average)} tkr</p>
      <p className="stat-sub">Median {Math.round(median)} tkr</p>
    </div>
  );
}
