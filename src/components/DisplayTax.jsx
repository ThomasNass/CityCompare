import { useCities } from "../context/city-context.jsx";

export default function DisplayTax({ city: cityKey }) {
  const city = useCities()[cityKey];

  if (Number.isNaN(city.tax)) {
    return <p>Skattesatser kunde inte hämtas</p>;
  }

  return (
    <div className="stat-card">
      <p className="stat-label">{city.name}</p>
      <p className="stat-value">{city.tax}%</p>
    </div>
  );
}
