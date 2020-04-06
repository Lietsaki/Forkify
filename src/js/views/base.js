export const elements = {
    searchForm:  document.querySelector(".search"),
    searchInput: document.querySelector(".search__field"),
    searchRes: document.querySelector(".results"),
    searchResList: document.querySelector(".results__list"),
    searchResPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    shopping: document.querySelector(".shopping__list"),
    likesMenu: document.querySelector(".likes__field"),
    likesList: document.querySelector(".likes__list")
}

// Note: ".recipe" is the whole block where the recipe information is displayed

export const elementStrings = {
    loader: "loader"
}

// Function to make the loader appear
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML("afterbegin", loader);
}

// Function to make the loader disappear
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};