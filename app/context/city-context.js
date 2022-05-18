import react from "react";

const CityContext = react.createContext();

export const CityProvider = CityContext.Provider
export const CityConsumer = CityContext.Consumer

export default CityContext