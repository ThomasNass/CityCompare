# CityCompare

En app som ska komma att jämföra städer.
Just nu finns enbart två hårdkodade städer att söka på; Mockholm och Mockköping.
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

## Build

"npx parcel build 'htmlfil' " funkar ej, då "main":"main.js" inte är filen som parcel vill ha där. Om man ändrar från main.js så kan man dock inte starta programmet längre.

