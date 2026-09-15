import ViewToggle from "./ViewToggle.jsx";

export default function Section({ title, source, mode, onModeChange, children, className = "" }) {
  return (
    <section className={`wrapper ${className}`}>
      <div className="card-header">
        <div>
          <h1>{title}</h1>
          <p className="card-source">{source}</p>
        </div>
        {onModeChange ? <ViewToggle value={mode} onChange={onModeChange} size="sm" /> : null}
      </div>
      {children}
    </section>
  );
}
