import { useCities } from "../context/city-context.jsx";

export default function HousePrice({ city: cityKey }) {
  const city = useCities()[cityKey];
  const price = Number(city.housePrice);

  if (!Number.isFinite(price)) {
    return <p>Snittpris kunde inte hämtas</p>;
  }

  return (
    <div className="stat-card">
      <p className="stat-label">{city.name}</p>
      <p className="stat-value">{price} tkr</p>
    </div>
  );
}
