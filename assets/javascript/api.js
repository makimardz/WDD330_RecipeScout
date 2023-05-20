const defaultRecipeImage = "./assets/images/defaultRecipe.jpg.png";

// ========  MULTIPLE RECIPES API CALL =======================================
/*
 *  Makes AJAX call to get the recipes based on the search criteria provided.
 *  Parameters:
 *    ingredients:   an array of ingredients to include in the recipe
 *    quantity:      the number of recipes to return 
 */
const getRecipes = (ingredients, quantity) => {
  // The next line changes the array into a string where each item is separated by %2C and any
  //   spaces in the search ingredients are replaced by a + 
  var convertedString = ingredients.join("%2C").replace(/ /g, "+");

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=${quantity}&ranking=1&ignorePantry=false&ingredients=${convertedString}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "13639e06b5msh6d9dc61e3c615b9p1f0efcjsn980ee447f232",
      "cache-control": "no-cache",
      "Postman-Token": "93e85d06-a15d-45b5-b778-3914b88e4fe0"
    }
  }

  $.ajax(settings).done(function (response) {
    var recipes = createRecipeArray(response);
    createRecipeOptionCards(recipes);
  });
}

// Generates an array of recipe objects. Each object contains the recipe ID, title, and image url.
function createRecipeArray(resp) {
  var recipes = [];
  resp.forEach((o) => {
    recipes.push({
      "id": o.id,
      "title": o.title,
      "image": o.image,
    })
  })
  return recipes;
}

/*
 * Creates recipe cards and puts them in the main-recipe-options box
 */
function createRecipeOptionCards(recipes) {
  let $recipeOptions = $("#main-recipe-options");
  $recipeOptions.empty();
  let recipeImage = "";
  for (i = 0; i < recipes.length; i++) {
      recipeImage = `<img id="recipe-${i}"
       class="recipe-option-image"
       src=${recipes[i].image}
       alt=${recipes[i].title}
       onerror="this.src='${defaultRecipeImage}'" >`

    $('#main-recipe-options').append(`<div id="recipe-${i}# class="m-1 justify-content-between recipe-card">
  <div class="card recipe-card"  recipe-id="${recipes[i].id}">
  ${recipeImage}
      <div class="py-1">
        <p class="card-text">${recipes[i].title}</p>
      </div>
    </div> `);
  }
}

// ======== SINGLE RECIPE API CALL ======================================
/*
 *  Makes AJAX call to get the recipe ingredients and instructions based on the recipe ID number in spoonacular.
 *  Parameters:
 *    id:   the integer id value representing a apecific spoonacular recipe
 */
const openRecipeDetailsPage = (id) => {

  var recipe = {};
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "13639e06b5msh6d9dc61e3c615b9p1f0efcjsn980ee447f232",
      "cache-control": "no-cache",
      "Postman-Token": "93e85d06-a15d-45b5-b778-3914b88e4fe0"
    }
  }

  $.ajax(settings).done(function (response) {
    recipe = createRecipeObject(response);
    // localStorage.clear();
    localStorage.setItem("data", JSON.stringify(recipe));
    window.open("recipeDetails.html")
  });

}

/* Generates a recipe object with the following key values:
 *  name:  recipe name
 *  image: url of image
 *  timeInMinutes:  total time recipe takes
 *  ingredients:  array contining ingredients used in recipe
 *  instructions: array of steps
 */
function createRecipeObject(resp) {
  let instructions = [];
  if (resp.analyzedInstructions.length > 0) {  // use step-by-step instructions if available
    instructions = getInstructions(resp.analyzedInstructions[0].steps);
  } else if (resp.instructions) {    // no step-by-step instructions, just use the paragraph provided
    instructions.push(resp.instructions);
  } else {    // no instructions are in the database
    instructions = ["No instructions provided"];
  }

  const ingredients = getIngredients(resp.extendedIngredients);
  const recipe = {
    "name": resp.title,
    "image": resp.image,
    "timeinMinutes": resp.readyInMinutes,
    "ingredients": ingredients,
    "instructions": instructions,
  }
  return recipe;
}

/*
 * 'steps' is an array of objects. We only want the one with the key named "step"
 * This function will loop through the array and create a new array with only the
 * step information from each object in the array.
 */
function getInstructions(steps) {
  let newArray = [];
  steps.forEach((s) => {
    newArray.push(s.step);
  })
  return newArray;
}

/*
 * 'items' is an array of objects. We only want the one with the key named "originalString"
 * This function will loop through the array and create a new array with only the
 * originalString information from each object in the array.
 */
function getIngredients(items) {
  let newArray = [];
  items.forEach((i) => {
    newArray.push(i.originalString)
  })
  return newArray;
}