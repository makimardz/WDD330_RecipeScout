var ingredients = []; // this array will contain ingredient objects (with name and image)

var defaultIngredients = ["chicken", "beef", "cheese", "salmon", "rice"]; // we can eventually put this in local storage
var searchItems = [];
const defaultImage = "./assets/images/groceries.png";
const defaultMeal = "./assets/images/defaultMeal.jpg";
/**
 * When an item in the selected items list is clicked, remove it from the searchItems array and update the list
 */
$(document).on("click", ".selected-item", function() {
  let food = $(this).attr("food-item");
  $(this).addClass("animated zoomOut");
  setTimeout(function() {
    let index = searchItems.indexOf(food);
    searchItems.splice(index, 1);
    updateSelectedItemsList("#selected-list"); // update modal list
    updateSelectedItemsList("#main-selected-list"); // update main page list
  }, 500);
});

/**
 * When an item is clicked, add it to the searchItems array and update the selected items list
 */
$(document).on("click", ".ingredient-option-image", function() {
  let food = $(this).attr("food-item");

  if (!searchItems.includes(food)) {
    searchItems.push(food);
    updateSelectedItemsList("#selected-list");
  }
});

/**
 * Delete ingredient item
 */
$(document).on("click", ".ingredient-delete", function() {
  let food = $(this).attr("food-item");

  for (i = 0; i < ingredients.length; i++) {
    if (ingredients[i].name === food) {
      ingredients.splice(i, 1);
      break;
    }
  }
  // remove item from seleted items list as well (if it is there)
  let index = searchItems.indexOf(food);
  if (index >= 0) {
    searchItems.splice(index, 1);
  }

  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  updateSelectedItemsList("#selected-list");
  createIngredientChoices();
});

/*
 * Creates ingredient containers (name and image) and puts them in the ingredients-options box
 */
const createIngredientChoices = () => {
  let $ingredientOptions = $("#ingredient-options");
  $ingredientOptions.empty();
  let foodImage = "";
  for (let i = 0; i < ingredients.length; i++) {
    $ingredientOptions.append(ingredientComponent(ingredients[i]));
  }
};

/**
 * Creates a card with a delete icon, a recipe image, and food name
 * @param {*} food
 */
const ingredientComponent = food => {
  const card = `
  
  <div class="card m-1 float-left ingredient-frame" >
  <div >
    <i class="float-right p-2 far fa-trash-alt ingredient-delete" food-item="${
      food.name
    }" ></i>
  </div>

  <img src="${
    food.image
  }" class="card-img ingredient-option-image" food-item="${food.name}" alt="${
    food.name
  }" onerror="this.src='${defaultImage}'" >
    <div class="card-image-overlay">
      <h5 class="card-text ingredient-name">${food.name}</h5>
    </div>
  </div>
  `;
  return card;
};

const updateSelectedItemsList = divId => {
  const $selectedList = $(divId);
  $selectedList.empty(); // clear out current list
  let makeString = '<div class="list-group">';
  for (i = 0; i < searchItems.length; i++) {
    makeString += `<button type="button" class="list-group-item list-group-item-action w-100 mx-auto text-center py-1 selected-item" food-item="${
      searchItems[i]
    }">${searchItems[i]}</button>`;
  }
  makeString += `</div>`;
  $selectedList.append(makeString);
};

// On click of add ingredient button
$("#add-ingredient").on("click", e => {
  e.preventDefault();
  var subject = $("#new-ingredient-input")
    .val()
    .trim();
  if (subject !== "" && !ingredientExists(subject)) {
    ingredients.push(createIngredientObject(subject));
    // localStorage.clear();
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
    createIngredientChoices();
  }
  $("#new-ingredient-input").val(""); // clear input field
});

// Returns true if ingredient exists in list, otherwise returns false
function ingredientExists(item) {
  var index = ingredients.filter(obj => {
    return obj.name === item;
  });
  if (index.length > 0) {
    return true;
  } else {
    return false;
  }
}

function createIngredientObject(item) {
  return {
    name: item,
    image: getIngredientImage(item)
  };
}

function getIngredientImage(food) {
  let findImage;
  try {
    findImage = `https://www.themealdb.com/images/ingredients/${food}.png`;
  } catch {
    findImage = "";
  }
  return findImage;
}

// ===========  FUNCTTIONS RELATED TO MAIN PAGE ============================
// Create a set of ingredient buttons to display on the main page
function createMainPageButtons() {
  let $mainIngredientBtns = $("#fav-btns");
  $mainIngredientBtns.empty();

  for (i = 0; i < ingredients.length; i++) {
    $mainIngredientBtns.append(`<div class="btn float-left px-1 py-0 main-item-background">
      <button type="button" class="btn text-center py-1 px-1 mx-0 main-item-button" food-item="${
        ingredients[i].name
      }">${ingredients[i].name}</button>
      <i class="far fa-trash-alt mt-1 px-1 main-ingredient-delete" food-item="${
        ingredients[i].name
      }" ></i></div>
    </div>`);
  }
}

$("#main-add-item").on("click", e => {
  e.preventDefault();
  var subject = $("#main-new-item-input")
    .val()
    .trim();
  if (subject !== "" && !ingredientExists(subject)) {
    ingredients.push(createIngredientObject(subject));
    // localStorage.clear();
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
    createMainPageButtons();
  }
  $("#main-new-item-input").val(""); // clear input field
});

$("#close-modal").on("click", () => {
  createMainPageButtons();
});

/**
 * When an main ingredient item is clicked, add it to the searchItems array and update the selected items list
 */
$(document).on("click", ".main-item-button", function() {
  let food = $(this).attr("food-item");
  if (!searchItems.includes(food)) {
    searchItems.push(food);
    updateSelectedItemsList("#main-selected-list");
  }
});

/**
 * When an trash can of ingredient item is clicked, remove it from the favorites and from the selected list
 */
$(document).on("click", ".main-ingredient-delete", function() {
  let food = $(this).attr("food-item");
  // right mouse click -- remove item button from ingredient options
  for (i = 0; i < ingredients.length; i++) {
    if (ingredients[i].name === food) {
      ingredients.splice(i, 1);
      break;
    }
  }
  // remove item from seleted items list as well (if it is there)
  let index = searchItems.indexOf(food);
  if (index >= 0) {
    searchItems.splice(index, 1);
  }

  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  updateSelectedItemsList("#main-selected-list");
  createMainPageButtons();
});

// Calls the function that makes the API call to get recipes. Initially set it to find 6 recipes
$("#main-get-recipes, #search-api").on("click", function() {
  getRecipes(searchItems, 6);
  $("#select-ingredients").modal("hide");
  updateSelectedItemsList("#main-selected-list");
  createMainPageButtons();
});

// ===================  SPECIFIC RECIPE DETAILS =================
/**
 * This function gets the id of the recipe that was clicked. Then it calls
 * opeRecipeDetailsPage, which does the AJAX call to get the recipe information
 * from the Spoonacular API.
 */
$(document).on("click", ".recipe-card", function() {
  const recipeId = $(this).attr("recipe-id");
  openRecipeDetailsPage(recipeId);
});

$(window).on("load", function() {
  localStorage.removeItem("recipe");

  ingredients = JSON.parse(localStorage.getItem("ingredients"));
  if (ingredients === null) {
    ingredients = [];
    defaultIngredients = ["chicken", "beef", "cheese", "salmon", "rice"]; // we can eventually put this in local storage
    defaultIngredients.forEach(item => {
      ingredients.push(createIngredientObject(item));
    });
  }
  createIngredientChoices();

  $("#select-ingredients").modal("show");
});
