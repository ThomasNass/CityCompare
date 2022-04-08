import { Page } from "./Page.js";

export class Contact extends Page {

    constructor(name) {
        super(name);
        this.name = name;
        this.content = [];
    }

    linkCreator(labelForLink, linktext, href) {
        const p = document.createElement("h2");
        const a = document.createElement("a");
        p.textContent = `${labelForLink
            }: `;
        a.href = href;
        a.target = "_blank";
        a.rel = "noopnener noreferrer";
        a.textContent = linktext;

        p.append(a);
        this.content.push(p);
    }

}