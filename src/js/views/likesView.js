import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

// This function defines if the heart is filled or empty, depending if it's has been liked or not
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";

    // Select the use element, a child of .recipe__love and set its href attribute
    document.querySelector(".recipe__love use").setAttribute("href", `img/icons.svg#${iconString}`); 
}

// Make the heart appear when we have a liked recipe. If there's zero likes, the heart is hidden
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
    elements.likesMenu.style.opacity = numLikes > 0 ? "100%" : "0%";
    elements.likesList.style.visibility = numLikes > 0 ? "visible" : "hidden";
}

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = id => {
    // Select elements with the class .likes__link whose href attribute has the value of the passed in ID
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;

    // Remove the 
    if(el) el.parentElement.removeChild(el);
}