import { Outlet } from "react-router-dom";
import "../../styles/compare.css";

export default function CompareLayout() {
  return (
    <div className="compare-layout">
      <main>
        <h1 id="site-name">CityCompare</h1>
        <div className="compare-root">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
