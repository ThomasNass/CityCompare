import { useCities } from "../context/city-context.jsx";

export default function HousePrice({ city: cityKey }) {
  const city = useCities()[cityKey];

  if (Number.isNaN(city.housePrice)) {
    return <p>Snittpris kunde inte hämtas</p>;
  }

  return (
    <div className="stat-card">
      <p className="stat-label">{city.name}</p>
      <p className="stat-value">{city.housePrice} tkr</p>
    </div>
  );
}
