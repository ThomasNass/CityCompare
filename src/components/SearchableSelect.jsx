import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function SearchableSelect({ className, name, onChange, array, placeholder = "Välj stad" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [selected, setSelected] = useState("");
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query) return array;
    const lower = query.toLowerCase();
    return array.filter((item) => item.toLowerCase().includes(lower));
  }, [array, query]);

  useEffect(() => {
    setHighlighted(-1);
  }, [filtered]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        if (!selected) setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const el = listRef.current.children[highlighted];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  const select = useCallback(
    (value) => {
      setSelected(value);
      setQuery(value);
      setOpen(false);
      onChange({ target: { name, value } });
    },
    [name, onChange]
  );

  function handleKeyDown(event) {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlighted((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (highlighted >= 0 && filtered[highlighted]) {
          select(filtered[highlighted]);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  }

  return (
    <div className={`searchable-select ${className || ""}`} ref={wrapperRef}>
      <input
        type="text"
        className="searchable-select-input"
        name={name}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value);
          setSelected("");
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul className="searchable-select-list" ref={listRef} role="listbox">
          {filtered.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={item === selected}
              className={`searchable-select-item${index === highlighted ? " highlighted" : ""}${item === selected ? " selected" : ""}`}
              onMouseEnter={() => setHighlighted(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                select(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && query && (
        <ul className="searchable-select-list">
          <li className="searchable-select-item no-results">Inga resultat</li>
        </ul>
      )}
    </div>
  );
}
