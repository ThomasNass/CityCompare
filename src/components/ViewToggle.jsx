export default function ViewToggle({ value, onChange, size = "md" }) {
  return (
    <div className={`view-toggle view-toggle-${size}`} role="group" aria-label="Visa senaste eller över tid">
      <button
        type="button"
        className={value === "latest" ? "active" : ""}
        onClick={() => onChange("latest")}
      >
        Senaste
      </button>
      <button
        type="button"
        className={value === "trend" ? "active" : ""}
        onClick={() => onChange("trend")}
      >
        Över tid
      </button>
    </div>
  );
}
