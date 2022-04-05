//Grundklassen för alla sidorna. Bör skapa de tre elementen: header, main och footer. Säg att en sida innehåller en text. url = slugg?

export class Page {
    constructor(name, content) {
        this.name = name;
        this.content = content;
    }

    renderPage() {
        const main = document.querySelector("#main");
        const p = document.createElement("p");
        while (main.firstChild) {
            main.firstChild.remove();
        }
        p.textContent = this.content;
        main.append(p);
        console.log(this.name, this.content);


    }
    renderTitle(renderTo) {
        const el = document.createElement("button");
        el.textContent = this.name;
        el.classList.add("title");

        el.addEventListener("click", this.renderPage.bind(this))
        renderTo.append(el);
    }
} 