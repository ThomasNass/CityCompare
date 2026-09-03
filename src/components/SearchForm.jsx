import { useCallback, useMemo, useState } from "react";
import SearchableSelect from "./SearchableSelect.jsx";
import Button from "./Button.jsx";
import CityComparison from "./CityComparison.jsx";
import { useCities } from "../context/city-context.jsx";
import cityArray from "../data/cities.json";

export default function SearchForm() {
  const { hasCities, setContext } = useCities();
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [loading, setLoading] = useState(false);
  const cities = useMemo(() => [...cityArray.cities].sort(), []);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      if (!cityArray.cities.includes(value)) return;
      if (name === "search1") setSearch1(value);
      if (name === "search2") setSearch2(value);
    },
    []
  );

  async function onClick() {
    if (search1.length === 0 || search2.length === 0) return;
    setLoading(true);
    try {
      await setContext(search1, search2);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SearchableSelect name="search1" array={cities} onChange={handleChange} placeholder="Sök stad 1..." />
      <SearchableSelect name="search2" array={cities} onChange={handleChange} placeholder="Sök stad 2..." />
      <Button id="compare-button" text="Jämför" onClick={onClick} />
      {loading ? <div className="loader" /> : hasCities ? <CityComparison /> : null}
    </>
  );
}
