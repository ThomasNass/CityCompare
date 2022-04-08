export class Page {
    constructor(name) {
        this.name = name;
        this.content = [];
    }

    renderPage() {
        const main = document.querySelector("#main");
        while (main.firstChild) {
            main.firstChild.remove();
        }
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        for (const element of this.content) {
            contentDiv.append(element)
        }
        main.append(contentDiv);
        console.log(this.name, this.content);


    }

    elementCreator(element, classList, text) {
        const el = document.createElement(element);
        if (classList) {
            const classes = classList.split(" ");
            for (const targetClass of classes) {
                el.classList.add(targetClass);
            }
        }
        el.textContent = text;
        this.content.push(el);
    }

    renderTitle(renderTo) {
        const el = document.createElement("a");
        el.textContent = this.name;
        el.classList.add("navbar-item");
        el.classList.add("activatable");
        // el.addEventListener("click", this.renderPage.bind(this))

        el.addEventListener("click", () => {
            this.renderPage();
            const allElements = document.querySelectorAll(".activatable");

            for (let element of allElements) {
                element.classList.remove("yellow");
            }
            el.classList.add("yellow");
        })

        renderTo.append(el);
    }
} 