import { Outlet } from "react-router-dom";
import "../../styles/compare.css";

export default function CompareLayout() {
  return (
    <div className="compare-layout">
      <main>
        <header className="compare-hero">
          <p className="compare-kicker">Sveriges kommuner</p>
          <h1 id="site-name">MuniMatch</h1>
          <p className="compare-tagline">Hitta kommunen som passar dig</p>
        </header>
        <div className="compare-root">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
