import { elements } from "./base";

// This automatically returns the value of the search input
export const getInput = () => elements.searchInput.value;

// Fuction to clear the input
export const clearInput = () => {
  elements.searchInput.value = "";
};

// Function to clear the results
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

// Function to highlight the recipe we select from the list
export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach(el => {
    el.classList.remove("results__link--active");
  });
  // The [attribute*=value] selector matches every element whose attribute value contains a specified value.
  // This test will prevent the "Uncaught (in promise) TypeError: Cannot read property 'classList' of null" error, which happened because
  // we're searching for an id that doesn't exist yet.
  const test = document.querySelector(`.results__link[href="#${id}"]`);

  if (test) document.querySelector(`.results__link[href="#${id}"]`).classList.add("results__link--active");
};

// Function to shorten the titles if they're longer than 17 characters
// "Pasta with tomato and spinach"
// acc: 0 | acc + cur.length = 5 | newTitle = ["Pasta"]
// acc: 5 | acc + cur.length = 9 | newTitle = ["Pasta", "with"]
// acc: 9 | acc + cur.length = 15 | newTitle = ["Pasta", "with", "tomato"]
// acc: 15 | acc + cur.length = 18 | newTitle = ["Pasta", "with", "tomato"] New words aren't added because we reached the character limit
// acc: 18 | acc + cur.length = 24 | newTitle = ["Pasta", "with", "tomato"] New words aren't added because we reached the character limit

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    // Return the result with the three dots in the end
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

// Function to render a recipe to the result list
const renderRecipe = recipe => {
  const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// Generate the type of pagination button: "prev" or "next"
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
        </svg>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    </button>
`;

// Function to render the pagination buttons
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // Only button to go to the next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both buttons
    button = `
        ${createButton(page, "prev")}
        ${createButton(page, "next")}
        `;
  } else if (page === pages && pages > 1) {
    // Only button to go to the previous page
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

// Render the results to the UI
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // Render the pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
