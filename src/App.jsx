import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout.jsx";
import CompareLayout from "./components/layout/CompareLayout.jsx";
import ProductIdea from "./pages/ProductIdea.jsx";
import BusinessPlan from "./pages/BusinessPlan.jsx";
import Contact from "./pages/Contact.jsx";

const Compare = lazy(() => import("./pages/Compare.jsx"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CompareLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<div className="loader" />}>
              <Compare />
            </Suspense>
          }
        />
      </Route>
      <Route element={<SiteLayout />}>
        <Route path="/produktide" element={<ProductIdea />} />
        <Route path="/affarside" element={<BusinessPlan />} />
        <Route path="/kontakt" element={<Contact />} />
      </Route>
      <Route path="/app" element={<Navigate to="/" replace />} />
      <Route path="/app.html" element={<Navigate to="/" replace />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
