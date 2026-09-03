import "../lib/chart.js";
import { ErrorBoundary } from "react-error-boundary";
import { CityProvider } from "../context/city-context.jsx";
import SearchForm from "../components/SearchForm.jsx";

function ErrorFallback({ error }) {
  return (
    <>
      <p style={{ color: "white", fontSize: "2rem" }}>Ett fel har uppstått</p>
      <p style={{ color: "white", fontSize: "2rem" }}>{error.message}</p>
      <button type="button" onClick={() => window.location.reload()}>
        Ladda om
      </button>
    </>
  );
}

export default function Compare() {
  return (
    <CityProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SearchForm />
      </ErrorBoundary>
    </CityProvider>
  );
}
