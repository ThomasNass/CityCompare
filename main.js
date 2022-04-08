import { productIdea } from "./pages/product-idea.js";
import { contact } from "./pages/contact.js";
import { buisnessPlan } from "./pages/buisness-plan.js"
const navbarStart = document.querySelector(".navbar-start");


productIdea.renderTitle(navbarStart);
buisnessPlan.renderTitle(navbarStart);
contact.renderTitle(navbarStart);



//This is code from bulma, for the hamburger to work
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});