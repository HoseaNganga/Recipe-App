const randomMealContainer = document.querySelector(`.randomMealContainer`);
const favoriteMealContainerFlex = document.querySelector(
  ".favoriteFoodContainerFlex"
);
const searchInput = document.getElementById(`searchFoodInput`);
const searchBtn = document.querySelector(`.searchFoodForm`);
const popContainer = document.querySelector(`.recipeInfoContainer`);
const popBtn = document.querySelector(`.close-popup`);
const recipeInfo = document.querySelector(".recipeInfoDescription");
console.log(
  randomMealContainer,
  favoriteMealContainerFlex,
  searchBtn,
  searchInput,
  popContainer,
  popBtn,
  recipeInfo
);

fetchFavMealsFromLs();
/* LOAD RANDOM MEAL FROM API */
getRandomMeal();
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  if (!resp.ok) throw Error(`Sorry..Couldnt get the resources`);
  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  console.log(randomMeal);
  loadRandomMeal(randomMeal, true);
}
/* SEARCH MEAL BY ID */
async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  if (!resp.ok) throw Error(`Sorry..Couldnt get the resources`);
  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  return randomMeal;
}
/* SEARCH MEAL BY TERM */

async function getMealsBySearchTerm(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  if (!resp.ok) throw Error(`Sorry..Couldnt get the resources`);
  const respData = await resp.json();
  const randomMeals = respData.meals;
  return randomMeals;
}

/* LOAD RANDOM MEAL TO PAGE */
function loadRandomMeal(mealData, random = false) {
  const displayRandomMealContainer = document.createElement(`div`);
  displayRandomMealContainer.className = "displayRandomMealContainer";
  displayRandomMealContainer.innerHTML = `${
    random ? `<h3>Random Meal</h3>` : ""
  }  
  <div class="randomMealImageContainer">
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
  </div>
  <div class="randomMealDescriptionContainer">
    <div class="randomMealDescriptionContainerFlex">
      <p class="randomMealDescription">${mealData.strMeal}</p>
      <button class="pushToFavoriteBtn">
        <i class="fa-solid fa-heart"></i>
      </button>
    </div>
  </div>`;
  randomMealContainer.appendChild(displayRandomMealContainer);

  //ADD FUNCTIONALITY TO PUSHTOFAVORITEBTN
  const pushToFavoriteBtn =
    displayRandomMealContainer.querySelector(".fa-heart");

  pushToFavoriteBtn.addEventListener("click", () => {
    console.log(pushToFavoriteBtn);
    if (pushToFavoriteBtn.classList.contains("is-active")) {
      deleteFromLs(mealData.idMeal);
      pushToFavoriteBtn.classList.remove("is-active");
    } else {
      addToLocalStorage(mealData.idMeal);
      pushToFavoriteBtn.classList.add("is-active");
    }
  });
  displayRandomMealContainer.addEventListener("click", () => {
    showMealInfo(mealData);
  });
}

/* FUNCTION TO add OUR FAVORITE MEALS TO LOCAL STORAGE */
function addToLocalStorage(mealId) {
  const toStoreMealIds = retrieveFromLs();

  localStorage.setItem(
    "storedMealIds",
    JSON.stringify([...toStoreMealIds, mealId])
  );
}

/* FUNCTION TO RETRIEVE MEAL DATA FROM LOCAL STORAGE */
function retrieveFromLs() {
  const storedMealIds = JSON.parse(localStorage.getItem("storedMealIds"));
  return storedMealIds || [];
}

/* FUNCTION TO REMOVE A MEAL FROM LOCAL STORAGE  */
function deleteFromLs(mealId) {
  const allMeals = retrieveFromLs();
  localStorage.setItem(
    "storedMealIds",
    JSON.stringify(allMeals.filter((mealid) => mealid !== mealId))
  );
}

/* FUNCTION TO FETCH FAV MEALS FROM LS */

async function fetchFavMealsFromLs() {
  favoriteMealContainerFlex.innerHTML = "";
  const allMealIds = retrieveFromLs();

  for (let i = 0; i < allMealIds.length; i++) {
    const mealId = allMealIds[i];
    console.log(mealId);
    const meal = await getMealById(mealId);
    addFavMealToFavMealContainer(meal);
  }
}

/* FUNCTION TO ADD FAVORITE MEAL TO FAVORITE MEAL CONTAINER */
function addFavMealToFavMealContainer(meal) {
  const favoriteFoodDiv = document.createElement("div");
  favoriteFoodDiv.className = "favoriteFoodDiv";
  favoriteFoodDiv.innerHTML = `<img src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }" />
    <p class="favoriteFoodDescription">${meal.strMeal.slice(0, 6)}...</p>
    <button class="deleteFavMeal hidden">X</button>
    `;
  /* ADD FUNCTIONALITY TO BUTTON TO DELETE A MEAL WHEN CLICKED */
  const deleteFavMealBtn = favoriteFoodDiv.querySelector(".deleteFavMeal");
  deleteFavMealBtn.addEventListener(`click`, () => {
    deleteFromLs(meal.idMeal);
    fetchFavMealsFromLs();
  });

  favoriteMealContainerFlex.appendChild(favoriteFoodDiv);
  favoriteFoodDiv.addEventListener("click", () => {
    showMealInfo(meal);
  });
}

/* FUNCTION TO DISPLAY SEARCHED ITEMS */

searchBtn.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  randomMealContainer.innerHTML = "";
  const searchValue = searchInput.value;
  console.log(searchValue);
  const meals = await getMealsBySearchTerm(searchValue);
  if (meals) {
    meals.forEach((meal) => {
      loadRandomMeal(meal);
    });
  }
});
/* FUNCTION TO DISPLAY RECIPEiNFO */
function showMealInfo(mealData) {
  recipeInfo.innerHTML = "";
  popContainer.classList.remove("hidden");
  const recipeDiv = document.createElement("div");
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }
  recipeDiv.innerHTML = `<h1>${mealData.strMeal}</h1>
    <img
      src="${mealData.strMealThumb}"
      alt=""
    />
    <p>
      ${mealData.strInstructions}
    </p>
    <h3>Ingredients</h3>
    <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
        </ul>`;
  recipeInfo.appendChild(recipeDiv);
}

/* ADD FUNCTIONALITY TO POP CONTAINER BUTTON */
popBtn.addEventListener(`click`, () => {
  popContainer.classList.add("hidden");
});
