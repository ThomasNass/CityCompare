import { useCities } from "../context/city-context.jsx";
import { partyColor, partyName, shareFor } from "../lib/parties.js";

function formatShare(value) {
  if (value == null) return "—";
  return `${value.toLocaleString("sv-SE", { maximumFractionDigits: 1 })} %`;
}

function ShareBar({ value, max, color, cityName }) {
  const width = value == null || !max ? 0 : Math.max((value / max) * 100, value > 0 ? 4 : 0);
  return (
    <div className="election-bar-cell">
      <span className="election-bar-city">{cityName}</span>
      <div className="election-bar-track">
        <div className="election-bar-fill" style={{ width: `${width}%`, background: color }} />
      </div>
      <span className="election-bar-value">{formatShare(value)}</span>
    </div>
  );
}

export default function ElectionCompare({ dataKey }) {
  const { city1, city2 } = useCities();
  const electionA = city1[dataKey];
  const electionB = city2[dataKey];
  const parties = [...new Set([...(electionA?.parties ?? []), ...(electionB?.parties ?? [])])];

  if (!parties.length) {
    return <p className="election-empty">Gick ej att hämta data</p>;
  }

  const rows = parties
    .map((party) => ({
      party,
      a: shareFor(electionA, party),
      b: shareFor(electionB, party),
    }))
    .sort((left, right) => Math.max(right.a ?? 0, right.b ?? 0) - Math.max(left.a ?? 0, left.b ?? 0));

  const max = Math.max(...rows.flatMap((row) => [row.a ?? 0, row.b ?? 0]), 1);

  return (
    <div className="election-compare">
      <div className="election-compare-head">
        <span className="election-party-head">Parti</span>
        <span>{city1.name}</span>
        <span>{city2.name}</span>
      </div>
      {rows.map((row) => {
        const color = partyColor(row.party);
        return (
          <div className="election-row" key={row.party}>
            <div className="election-party">
              <span className="election-swatch" style={{ background: color }} />
              <span className="election-code">{row.party}</span>
              <span className="election-name">{partyName(row.party)}</span>
            </div>
            <ShareBar value={row.a} max={max} color={color} cityName={city1.name} />
            <ShareBar value={row.b} max={max} color={color} cityName={city2.name} />
          </div>
        );
      })}
    </div>
  );
}
