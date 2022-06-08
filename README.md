# CityCompare

En app som jämför kommuner baserat på population, ekonomi, jobb och företagsutbud.

## Install

Clone repo
run "npm ci"


## start

 "npm run start" för att starta app och node-server
open a browser and go to http://localhost:3000/app.html

"npx parcel index.html --open" (För att öppna sidan om appen)



## Externa bibliotek
axios - Används för att göra http-anrop på ett smidigare sätt än fetch. Min applikation är datadriven, så jag använder detta mycket. 

chart.js - Används för att göra olika diagram. Använder för att presentera datan på ett snyggt och enkelt sätt.

react-chartjs-2 - Används specifikt för react. Det är egentligen detta jag använder, men det fungerar inte utan chart.js

npm-run-all - Används för att köra flera scripts samtidigt

PropTypes - Används för att tvinga användingen av rätt type på props i komponenterna.




## Tjänster
Skatteverket - används för att hämta skattesatser per kommun. https://www.dataportal.se/sv/datasets/6_68000/skattesatser-per-kommun#ref=?p=1&q=&s=8&t=100&f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fformat%7C%7Capplication%2Fjson%7C%7Cfalse%7C%7Cliteral_s%7C%7CFormat%7C%7Capplication%2Fjson%24http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7Chttps%3A%2F%2Fskatteverket.entryscape.net%2Fstore%2F9%2Fresource%2F1%7C%7Cfalse%7C%7Curi%7C%7COrganisation%7C%7CSkatteverket&rt=esterms_IndependentDataService%24esterms_ServedByDataService&c=false

SCB - används för att hämta data gällande population och inkomst.

https://www.scb.se/en/services/open-data-api/api-for-the-statistical-database/

JobTechDev - används för att hämta in jobbannonser relevanta för kommunen

https://links.api.jobtechdev.se/

Hitta.se - används för att hämta in företag ifrån de olika städerna.

https://www.hitta.se/api

## data-list - en genrell och återanvändingsbar komponent
Komponenten är ett datalist-input element. Den tar en rad egenskaper som man vanligtvis kan sätta på ett html-element så som class, placeholder etc. Den tar även en onChange för att användaren ska kunna bestämma vad som händer när den förändras. Det som är mest spännande med komponenten är att den tar en array som den sedan genererar de olika valen i datalistan som användaren sedan kan klicka på.

