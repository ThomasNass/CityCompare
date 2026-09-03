import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/app", label: "Applikation", end: false },
  { to: "/produktide", label: "Produktidé", end: true },
  { to: "/affarside", label: "Affärsidé", end: true },
  { to: "/kontakt", label: "Kontakt", end: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/" onClick={() => setOpen(false)}>
            <h1 className="title is-1 brand">Kommunkollen</h1>
          </Link>
          <button
            type="button"
            className={`navbar-burger${open ? " is-active" : ""}`}
            aria-label="menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <div id="navbarBasicExample" className={`navbar-menu${open ? " is-active" : ""}`}>
          <div className="navbar-start">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  `navbar-item activatable${isActive ? " is-active" : ""}`
                }
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
