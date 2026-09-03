import { Link, Outlet } from "react-router-dom";
import "../../styles/compare.css";

export default function CompareLayout() {
  return (
    <div className="compare-layout">
      <main>
        <h1 id="site-name">CityCompare</h1>
        <Link className="home-link" to="/">
          Till startsidan
        </Link>
        <div className="compare-root">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
