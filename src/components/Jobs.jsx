import { useState } from "react";
import { useCities } from "../context/city-context.jsx";
import Button from "./Button.jsx";
import JobExtraInfo from "./JobExtraInfo.jsx";
import occupations from "../data/occupations.json";
import { jobsByField } from "../services/services.js";

export default function Jobs({ city: cityKey }) {
  const context = useCities();
  const [showJob, setShowJob] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [filteredCity, setFilteredCity] = useState(null);
  const [updating, setUpdating] = useState(false);

  const city = selectValue ? filteredCity : context[cityKey];

  async function handleChange(event) {
    const value = event.target.value;
    setSelectValue(value);

    if (!value) {
      setFilteredCity(null);
      return;
    }

    setShowJob(false);
    setUpdating(true);
    try {
      const jobs = await jobsByField([value], [context[cityKey].id]);
      setFilteredCity({
        name: context[cityKey].name,
        jobs,
      });
    } finally {
      setUpdating(false);
    }
  }

  if (updating) {
    return <p>uppdaterar</p>;
  }

  if (!city || !("total" in city.jobs)) {
    return <p>Det gick inte att hämta jobbdata</p>;
  }

  return (
    <>
      <h2>{city.name}</h2>
      <select value={selectValue} onChange={handleChange}>
        <option value="">Utan filter</option>
        {occupations.map((occupation) => (
          <option key={occupation["taxonomy/id"]} value={occupation["taxonomy/id"]}>
            {occupation["taxonomy/preferred-label"]}
          </option>
        ))}
      </select>
      <h2>{city.jobs.total.value}</h2>
      <Button
        id="job-button"
        onClick={() => setShowJob((value) => !value)}
        text={showJob ? "Dölj lediga jobb" : "Visa lediga jobb"}
      />
      {showJob
        ? city.jobs.hits.map((hit) => <JobExtraInfo key={hit.id} hit={hit} />)
        : null}
    </>
  );
}
