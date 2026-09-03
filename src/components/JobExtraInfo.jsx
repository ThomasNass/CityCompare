import { useState } from "react";
import Button from "./Button.jsx";

export default function JobExtraInfo({ hit }) {
  const [extra, setExtra] = useState(false);

  return (
    <div className="job-hit-div">
      <h2>
        {hit.headline}{" "}
        <Button
          id="job-extra"
          onClick={() => setExtra((value) => !value)}
          text={extra ? "Dölj" : "Visa"}
        />
      </h2>
      {extra ? (
        <>
          <h3>Typ av tjänst: {hit.occupation_group.label}</h3>
          <h3>Anställare: {hit.employer.name}</h3>
          <h4>{hit.brief}</h4>
          <p>
            <a href={hit.source_links[0].url} target="_blank" rel="noopener noreferrer">
              <Button id="job-button" text="Sök här" />
            </a>
          </p>
        </>
      ) : null}
    </div>
  );
}
