import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

// Global state of our app
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {};
//window.state = state;

// SEARCH CONTROLLER
const controlSearch = async () => {
  // 1) Get the query from the view
  const query = searchView.getInput();

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on the UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("OOOOPS, something wrong with the search.");
      clearLoader();
    }
  }
};

// Event Listener for the Search
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault(); // This prevents the page from reloading every time we click on "Search", preventing the default action of that button.
  controlSearch();
});

// Use event.target.closest on the next page button so it'll be fired even when we click on elements within that button, like the svg arrow icon
elements.searchResPages.addEventListener("click", e => {
  // Quick note: The "e" here is a parameter of our EventListener callback that represents the object of that event.
  const btn = e.target.closest(".btn-inline"); // No matter if we click on any element of the button, we'll always get the button as a result.
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

// ======================================================= RECIPE CONTROLLER ============================================================= //

const controlRecipe = async () => {
  // Get the ID from the url
  const id = window.location.hash.replace("#", ""); // The .replace is to get rid of the "#". The result will be the number alone.

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create a new Recipe oject
    state.recipe = new Recipe(id);

    try {
      // Get Recipe data and parse ingredients
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("Error processing recipe");
    }
  }
};

// This is a way of adding two or more Event Listeners in the same line. "event" is every element of that array.
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

// ====================================================== LIST CONTROLLER ========================================================== //

const controlList = () => {
  // 1) Create a new list if there's none yet
  //  if(!state.list){
  state.list = new List();
  //  }

  // 2) Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// HANDLE DELETE AND UPDATE LIST ITEM EVENTS
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete event
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from the state
    state.list.deleteItem(id);

    // Delete from the UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Note1: Remember that we're adding an event listener to elements.shopping, which is the .shopping__list class,
// an unordered list that contains all the ingredients of our shopping list.

// Note2: No matter where we click on the user interface within the .shopping__list class, it could be on the ingredient
// name or on the count, it'll always go to the closest shopping item and read the ID from that one.

// ==================================================== LIKES CONTROLLER ================================================================== //

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // If the recipe is not liked
  if (!state.likes.isLiked(currentID)) {
    // 1) Add like to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // 2) Toggle the like button
    likesView.toggleLikeBtn(true);

    // 3) Add like to the UI list
    likesView.renderLike(newLike);
  } else {
    // If the recipe is liked
    // 1) Remove like from the state
    state.likes.deleteLike(currentID);

    // 2) Toggle the like button
    likesView.toggleLikeBtn(false);

    // 3) Remove like from the UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener("load", () => {
  // Create a new likes object
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle likes menu button if we have more than 0 liked recipes
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes || Note: state.likes refers to the likes class, then .likes refers to the newly created array of likes from the localStorage
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// ================================================= Handling recipe button clicks ======================================================== //
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn-add, .recipe__btn-add *")) {
    // Add an item to the shopping list
    listView.clearList();
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Call the likes controller
    controlLike();
  }
  //console.log(state.recipe);
});

// Note: elements.recipe comes from base.js and it's the whole block where the recipe information is shown
// Note2: If the target, that is, the element selected within elements.recipe, matches .btn-decrease or any children of it,
// the code inside the if statement will be executed
// Note3: .btn-decrease * means "all the children of btn-decrease"
