//kontaktuppgifter
import { Contact } from "../classes/Contact.js";

export const contact = new Contact("Kontakt");

contact.elementCreator("h1", "kontakt", "Thomas Näss");
contact.linkCreator("CV", "ThomasNass.github.io", "https://thomasnass.github.io/");
contact.linkCreator("GitHub", "github.com/ThomasNass", " https://github.com/ThomasNass?tab=repositories");
contact.linkCreator("Mail", "tn900323@gmail.com", "mailto: tn900323@gmail.com");

contact.linkCreator("Telefonnummer", "0763360168", "tel:0763360168")






