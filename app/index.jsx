import ReactDom from "react-dom";
import Page from "./components/page.jsx"
import { CityProvider } from "./context/city-context.js";

ReactDom.render(<CityProvider><Page /></CityProvider>, document.getElementById("root"));