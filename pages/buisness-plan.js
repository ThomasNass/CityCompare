//denna vyn ska beskriva affärsidéen const bp = new Page("namnet","innehållet");
import { Page } from "../Page.js";



export const buisnessPlan = new Page("Affärsidé");

buisnessPlan.elementCreator("h1", "h1", "Affärsidé");
buisnessPlan.elementCreator("p", "p", "CityCompare är en tjänst för att jämföra städer i Sverige. Det som jämförs städerna emellan är levnadsförhållanden och ekonomi i kommunerna de ligger i samt utbud när det kommer till butiker, restauranger, skolor, sjukhus med mera. Det finns för närvarande ingen tjänst som gör detta, så den har ett First mover advantage.");

buisnessPlan.elementCreator("p", "h2", "Tjänsten kommer att använda sig av API: er för att hämta in datan som ska presenteras, hostingleverantör för att hosta lösningen, och en betaltjänstleverantör för att ta betalt i tjänsten.");

buisnessPlan.elementCreator("p", "p", "Tjänsten kommer att vara en freemium / premiumtjänst med två finansiella ben att stå på: annonsintäkter från kommuner och näringsidkare, samt intäkter från premiumkunder.");

buisnessPlan.elementCreator("p", "p", "Tjänsten kommer att skapas av ett litet team bestående av två skickliga utvecklare, under en tidsperiod av tre månader där avtal för outsourcing kommer ingås i första månaden, följt av en tvåmånadersperiod där tjänsten färdigställs. Därefter drar marknadsföringen igång.");
buisnessPlan.elementCreator("p", "p", "Tjänsten kommer att kosta 191 000 kronor att få till underhålls / vidareutvecklingsläge och den kommer att generera avkastning direkt om marknadsföringen görs korrekt.");