# CityCompare

En app som jämför kommuner. Tanken är att den ska jämföra städers utbud av butiker, restauranger etc i tabellen som dyker upp längst ner i appen, men jag har ännu inte fått appen att fungera med googles api eller hitta.se:s api, så den datan har mockdata för stunden. 

För att logga in så är uppgifterna:
användarnamn: Användare
Lösenord:   Lösenord

## Install

Clone repo
run "npm ci"

## start

"run npm start-server" för att starta servern som mockdatan finns på

öppna en till terminal och kör "npm start" för att starta appen

"npx parcel index.html --open" (För att öppna sidan om appen)



## Externa bibliotek
axios - Används för att göra http-anrop på ett smidigare sätt än fetch. Min applikation är datadriven, så jag använder detta mycket. 
chart.js - Används för att göra olika diagram. Använder för att presentera datan på ett snyggt och enkelt sätt.
react-chartjs-2 - Används specifikt för react. Det är egentligen detta jag använder, men det fungerar inte utan chart.js
json-server - Används för att sätta upp ett eget REST-API. Jag använder den till att lagra mockdata för att kunna rendera tabellen med företag i.


## Tjänster
Sveriges Kommuner och Regioner - används för att hämta in folkmängd, i mitt fall per kommun https://www.dataportal.se/sv/datasets/653_26835/kommunkod-kommunnamn-folkmangd-20201231-skr-s-kommungrupp-lan-och-region#ref=?p=1&q=&s=2&t=20&f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fformat%7C%7Capplication%2Fjson%7C%7Cfalse%7C%7Cliteral_s%7C%7CFormat%7C%7Capplication%2Fjson%24http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7Chttps%3A%2F%2Fcatalog.skl.se%2Fstore%2F1%2Fresource%2F1%7C%7Cfalse%7C%7Curi%7C%7COrganisation%7C%7CSveriges%20Kommuner%20och%20Regioner%20(SKR)&rt=esterms_IndependentDataService%24esterms_ServedByDataService&c=false

Skatteverket - används för att hämta skattesatser per kommun. https://www.dataportal.se/sv/datasets/6_68000/skattesatser-per-kommun#ref=?p=1&q=&s=8&t=100&f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fformat%7C%7Capplication%2Fjson%7C%7Cfalse%7C%7Cliteral_s%7C%7CFormat%7C%7Capplication%2Fjson%24http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7Chttps%3A%2F%2Fskatteverket.entryscape.net%2Fstore%2F9%2Fresource%2F1%7C%7Cfalse%7C%7Curi%7C%7COrganisation%7C%7CSkatteverket&rt=esterms_IndependentDataService%24esterms_ServedByDataService&c=false

Kronofogden - används för att hämta data relaterat till kronofogdeärenden, i mitt fall så hämtar jag skuldsaneringssöknader och vräkningsansökningar/vräkningar

SKULDSANERING: https://www.dataportal.se/sv/datasets/265_3115/antal-skuldsaneringsansokningar-till-kronofogden#ref=?p=1&q=&s=8&t=100&f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fformat%7C%7Capplication%2Fjson%7C%7Cfalse%7C%7Cliteral_s%7C%7CFormat%7C%7Capplication%2Fjson%24http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7Chttps%3A%2F%2Fkronofogden.entryscape.net%2Fstore%2F2%2Fresource%2F1%7C%7Cfalse%7C%7Curi%7C%7COrganisation%7C%7CKronofogdemyndigheten&rt=esterms_IndependentDataService%24esterms_ServedByDataService&c=false

VRÄKNINGSDATA : https://www.dataportal.se/sv/datasets/265_3861/antal-ansokningar-om-vrakning-och-hur-manga-som-genomforts-i-sverige#ref=?p=1&q=&s=8&t=100&f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fformat%7C%7Capplication%2Fjson%7C%7Cfalse%7C%7Cliteral_s%7C%7CFormat%7C%7Capplication%2Fjson%24http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7Chttps%3A%2F%2Fkronofogden.entryscape.net%2Fstore%2F2%2Fresource%2F1%7C%7Cfalse%7C%7Curi%7C%7COrganisation%7C%7CKronofogdemyndigheten&rt=esterms_IndependentDataService%24esterms_ServedByDataService&c=false

