//denna vyn för att beskriva projektidéen
import { Page } from "../classes/Page.js";
export const productIdea = new Page("Produktidé");


productIdea.elementCreator("h1", "h1", "Produktidé");
productIdea.elementCreator("p", "p", "Idéen är att en användare ska kunna skriva in namnet på två städer för att sedan få en jämförelser av dem. Jämförelsen ska bestå av utbud på butiker, restauranger, skolor och levnadsförhållanden med mera.");
productIdea.elementCreator("h2", "h2", "API:er");
productIdea.elementCreator("p", "p", "Datan ska hämtas ifrån antingen API:et Google Places, eller hitta.se:s api. Med tanke på att båda api:erna tar betalt per sökning så är planen att hämta data för ett par valda städer, sedan spara undan den datan i en JSON-fil. Sedan används JSON-datan för att visa vad tjänsten är kapabel till.");
productIdea.elementCreator("h2", "h2", "Presentation av data");
productIdea.elementCreator("p", "p", "Datan ska presenteras i en tabell med två kolumner; en per stad. Sedan så fylls tabellen med rader av datapunkter som jämförs. Exempelvis så berättar en rad i varje kolumn om en städerna har varuhuset Rusta.");
