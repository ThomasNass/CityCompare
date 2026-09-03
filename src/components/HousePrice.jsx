import { useCities } from "../context/city-context.jsx";

export default function HousePrice({ city: cityKey }) {
  const city = useCities()[cityKey];

  if (Number.isNaN(city.housePrice)) {
    return <p>Snittpris kunde inte hämtas</p>;
  }

  return (
    <div>
      <h2>{city.name}</h2>
      <h2>{city.housePrice} tkr</h2>
    </div>
  );
}
