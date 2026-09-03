import { Outlet } from "react-router-dom";
import "../../styles/site.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function SiteLayout() {
  return (
    <div className="site-layout">
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
