//denna vyn för att beskriva projektidéen
import { Page } from "../page.js"
export const productIdea = new Page("Produktidé");


productIdea.elementCreator("h1", "h1", "Produktidé");
productIdea.elementCreator("p", "p", "Idéen är att en användare ska kunna skriva in namnet på två städer för att sedan få en jämförelser av dem. Jämförelsen ska bestå av utbud på butiker, restauranger, skolor, levnadsförhållanden med mera.");
productIdea.elementCreator("h2", "h2", "API:er");
productIdea.elementCreator("p", "p", "Datan ska hämtas ifrån antingen API:et Google Places, eller hitta.se:s api.");
productIdea.elementCreator("h2", "h2", "Stil?");
productIdea.elementCreator("p", "p", "Snyggt ska det vara.");
