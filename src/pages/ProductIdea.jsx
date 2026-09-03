export default function ProductIdea() {
  return (
    <div className="page-content">
      <h1 className="title is-1">Produktidé</h1>
      <p>
        Idéen är att en användare ska kunna skriva in namnet på två städer för att sedan få en
        jämförelser av dem. Jämförelsen ska bestå av utbud på butiker, restauranger, skolor och
        levnadsförhållanden med mera.
      </p>
      <h2 className="title is-3">API:er</h2>
      <p>
        Datan ska hämtas ifrån antingen API:et Google Places, eller hitta.se:s api. Med tanke på
        att båda api:erna tar betalt per sökning så är planen att hämta data för ett par valda
        städer, sedan spara undan den datan i en JSON-fil. Sedan används JSON-datan för att visa
        vad tjänsten är kapabel till.
      </p>
      <h2 className="title is-3">Presentation av data</h2>
      <p>
        Datan ska presenteras i en tabell med två kolumner; en per stad. Sedan så fylls tabellen
        med rader av datapunkter som jämförs. Exempelvis så berättar en rad i varje kolumn om en
        städerna har varuhuset Rusta.
      </p>
    </div>
  );
}
