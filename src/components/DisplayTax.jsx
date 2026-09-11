import { useCities } from "../context/city-context.jsx";

export default function DisplayTax({ city: cityKey }) {
  const city = useCities()[cityKey];
  const tax = Number(city.tax);

  if (!Number.isFinite(tax)) {
    return <p>Skattesatser kunde inte hämtas</p>;
  }

  return (
    <div className="stat-card">
      <p className="stat-label">{city.name}</p>
      <p className="stat-value">
        {tax.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
      </p>
    </div>
  );
}
