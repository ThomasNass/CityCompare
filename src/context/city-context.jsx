import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getActualCityData } from "../services/services.js";
import cityArray from "../data/cities.json";

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [city1, setCity1] = useState(null);
  const [city2, setCity2] = useState(null);

  const getCities = useCallback(async (search1, search2) => {
    const nextCity1 = { name: search1, population: {} };
    const nextCity2 = { name: search2, population: {} };

    for (const element of cityArray.jobMunicipality) {
      if (element["taxonomy/preferred-label"] === search1) {
        nextCity1.lauCode = element["taxonomy/lau-2-code-2015"];
        nextCity1.id = element["taxonomy/id"];
      }
      if (element["taxonomy/preferred-label"] === search2) {
        nextCity2.lauCode = element["taxonomy/lau-2-code-2015"];
        nextCity2.id = element["taxonomy/id"];
      }
    }

    await getActualCityData(nextCity1, nextCity2);
    setCity1(nextCity1);
    setCity2(nextCity2);
  }, []);

  const value = useMemo(
    () => ({
      city1,
      city2,
      setContext: getCities,
      hasCities: Boolean(city1 && city2),
    }),
    [city1, city2, getCities]
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCities() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCities must be used within a CityProvider");
  }
  return context;
}

export default CityContext;
