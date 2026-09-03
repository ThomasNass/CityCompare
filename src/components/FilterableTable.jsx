import { useEffect, useState } from "react";
import BusinessRows from "./BusinessRows.jsx";
import InputField from "./InputField.jsx";
import { getBuiseness, getBuisnesses } from "../services/services.js";
import { useCities } from "../context/city-context.jsx";
import Button from "./Button.jsx";
import franchises from "../data/franchises.json";

function filteredBuisnesses(cities, filter) {
  return cities.filter((city) => city.buisness.toLowerCase().includes(filter.toLowerCase()));
}

export default function FilterableTable() {
  const { city1, city2 } = useCities();
  const [filterText, setFilterText] = useState("");
  const [search, setSearch] = useState("");
  const [citiesCompared, setCitiesCompared] = useState([]);
  const [extraComparison, setExtraComparison] = useState([]);
  const [done, setDone] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFranchises() {
      for (const franchise of franchises.franchises) {
        if (cancelled) return;
        const [comparison, error] = await getBuisnesses(
          city1.name.toLowerCase(),
          city2.name.toLowerCase(),
          franchise
        );
        if (cancelled) return;
        if (!error) {
          setCitiesCompared((previous) => previous.concat(comparison));
          setDone(true);
        } else {
          setDown(true);
        }
      }
    }

    loadFranchises();
    return () => {
      cancelled = true;
    };
  }, [city1.name, city2.name]);

  async function extraSearch() {
    if (extraComparison.some((entry) => entry.buisness === search)) return;

    const [extra, error] = await getBuiseness(
      city1.name.toLowerCase(),
      city2.name.toLowerCase(),
      search
    );
    if (error == null) {
      setExtraComparison((previous) => previous.concat(extra));
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "filterText") setFilterText(value);
    if (name === "search") setSearch(value);
  }

  if (!done) {
    return <p>{down ? "Det går ej att hämta företagen just nu" : "Rendering.."}</p>;
  }

  const citiesFiltered = filteredBuisnesses(citiesCompared, filterText);

  return (
    <>
      <div className="Table">
        <InputField
          className="filter-input"
          placeholder="Filtrera tabell.."
          name="filterText"
          value={filterText}
          onChange={handleChange}
        />
        <table>
          <thead>
            <tr>
              <td>Företag</td>
              <td>{city1.name}</td>
              <td>{city2.name}</td>
            </tr>
          </thead>
          <tbody>
            <BusinessRows cities={citiesFiltered} />
          </tbody>
        </table>
      </div>
      <div id="extra-seach-div">
        <InputField
          className="extra-search-input"
          placeholder="Saknar du något?"
          name="search"
          value={search}
          onChange={handleChange}
        />
        <Button id="extra-search-button" text="Sök" onClick={extraSearch} />
      </div>
      {extraComparison.length > 0 ? (
        <div className="Table">
          <table>
            <thead>
              <tr>
                <td>Extra jämförelse</td>
                <td>{city1.name}</td>
                <td>{city2.name}</td>
              </tr>
            </thead>
            <tbody>
              <BusinessRows cities={extraComparison} />
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
