const defaultRecipeImage = "./assets/images/groceries.png";

window.onload = function() {
  const data = JSON.parse(localStorage.getItem("data"));
  updateRecipeDetails(data);
};

const getDetailsRecipeImage = data => {
  let recipeImageHTML = "";
  if (data.image !== "") {
    recipeImageHTML = `<img 
     class="recipe-image d-block mx-auto"
     src=${data.image}
     onerror="this.src='${defaultRecipeImage}'" >`;
  }
  return recipeImageHTML;
};

/**
 * Create an unordered list of ingredients
 * @param {*} instr : array of strings containing the ingredients
 */
const getDetailsIngredients = instr => {
  let buildStr = `<ul class="list-group">`;
  instr.forEach(elem => {
    buildStr += `<li class="list-group-item">${elem}</li>`;
  });
  buildStr += "</ul>";
  return buildStr;
};

/**
 * Create an ordered list of instructions
 * @param {*} instr : array of strings containing the ingredients
 */
const getDetailsInstructions = instr => {
  let buildStr = `<ol class="list-group">`;
  instr.forEach((elem, index) => {
    buildStr += `<li class="list-group-item">${index +
      1}. &nbsp&nbsp${elem}</li>`;
  });
  buildStr += "</ol>";
  return buildStr;
};

const updateRecipeDetails = data => {
  $("#recipe-details-image").append(getDetailsRecipeImage(data));
  $("#recipe-details-title").append(`<h2>${data.name}</h2>`);
  $("#recipe-details-ingred").append(getDetailsIngredients(data.ingredients));
  $("#recipe-details-instr").append(getDetailsInstructions(data.instructions));
};
