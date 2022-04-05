//Här är filen som hämtar och skapar sidorna baserat på vilken knapp som trycks på i headern
import { projectIdea } from "./pages/project-idea.js";
import { contact } from "./pages/contact.js";
import { buisnessPlan } from "./pages/buisness-plan.js"
const header = document.querySelector("#header");

projectIdea.renderTitle(header);
contact.renderTitle(header);
buisnessPlan.renderTitle(header);
