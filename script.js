//GET RELEVANT DOM ELEMENTS
const meals=document.getElementById(`mealsid`);
const ulEl=document.getElementById(`favoritemeals`);
const inputValue=document.getElementById(`inputSearch`);
const filterButton=document.getElementById(`filterButton`);
const recipeInfoContainer=document.querySelector(`.recipeInfo`);

// FUNCTION TO LOAD RANDOM MEAL
getRandomMeal();
fetchFavMeal();
async function getRandomMeal(){
    const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const respData=await resp.json();
    const randommeal=respData.meals[0];
    loadRandomMeal(randommeal,true);

}

//FUNCTION GET MEAL BY ID
async function getMealById(id){
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" +id);
    const respData=await resp.json();
    const meal=respData.meals[0];
    return meal;
}

//FUNCTION GET MEAL BY SEARCH 
async function getMealBySearch(searchTerm){ 
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+searchTerm);
    const respData=await resp.json();
    const meal=respData.meals;
    return meal;
}

//FUNCTION TO LOAD RANDOM MEAL TO OUR DIV CONTAINER
function loadRandomMeal(mealData,random=false){
    //CREATE DIV ELEMENT THAT WILL HOLD IMAGE AND DESCRIPTION
    const mealDiv=document.createElement(`div`);
    //ADD CSS CLASS
    mealDiv.className=`meal`;
    //ADD INNERHTML CONTEXT
    mealDiv.innerHTML=
    `${random?`<span class="random" id="randommeal">Random Meals</span>`:""}
    <div class="mealHeader">
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="mealBody">
        <h4>${mealData.strMeal}</h4>
        <button class="mealbtn">❤️</button>
    </div>
    <button class="recipe">View recipe</button>`;
    //APPEND THE NEW DIV TO THE MEAL CONTAINER
    meals.appendChild(mealDiv);
    console.log(mealData);

    //FUNCTION TO VIEW RECIPE..ADD EVENT LISTENER TO THE RECIPE BUTTON
    const recipeButton=mealDiv.querySelector(`.recipe`);
    recipeButton.addEventListener(`click`,()=>{
        recipeInfoContainer.innerHTML=``;
        recipeInfoContainer.classList.toggle(`hidden`);
        if(!recipeInfoContainer.classList.contains(`hidden`)){
            //CREATE A NEW DIV 
            const newDivEl=document.createElement(`div`);
            newDivEl.className=`mealinfo`;
            newDivEl.innerHTML=
            `<button class="popup" id="popupBtn">X</button>
            <h2>${mealData.strMeal}</h2>
            <div class="imgdiv">
                <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
            </div>
            <p>${mealData.strInstructions}</p>
            <h3>Ingredients</h3>
            <ul id="ingredients">
                <li>${mealData.strIngredient1}</li>
                <li>${mealData.strIngredient2}</li>
                <li>${mealData.strIngredient3}</li>
            </ul>`
            //APPEND THE CREATED ELEMENT
            recipeInfoContainer.appendChild(newDivEl);
            //GET THE POPUP BUTTON
            const popupBtn=newDivEl.querySelector(`.popup`);
            //ADD EVENT LISTENER TO THE POP UP BUTTON
            popupBtn.addEventListener(`click`,()=>{
                recipeInfoContainer.classList.add(`hidden`);
            })
        }
    })

    //GET THE BUTTON TO ADD A CLICKED RANDOM FOOD AS A FAVORITE
    const favAddButton=mealDiv.querySelector(`.mealbtn`);
    favAddButton.addEventListener(`click`,()=>{
        if(favAddButton.classList.contains
            (`active`)){
                removeMealFromLs(mealData.idMeal);
                favAddButton.classList.remove(`active`)
                console.log(favAddButton);
            }else{
                favAddButton.classList.add(`active`);
                addMealsToLs(mealData.idMeal);
                console.log(favAddButton);
            }
            
            fetchFavMeal();
    })

}

//ADD FAVORITE MEALS TO LS WHEN FAVBUTTON IS CLICKED
function addMealsToLs(mealid){
    const mealsid=getMealsFromLs()
    //STORE OUR MEALID VALUE AND UPDATE IT ONCE CALLED FROM THE LS
    localStorage.setItem(`mealsid`,JSON.stringify([...mealsid,mealid]));
}

function removeMealFromLs(mealid){
    const mealsid=getMealsFromLs();

    localStorage.setItem(`mealsid`,JSON.stringify(mealsid.filter(id=>id!==mealid)));

}

function getMealsFromLs(){
    //GET AN OBJECT WHICH WE PARSE
    const mealsid=JSON.parse(localStorage.getItem("mealsid"));
    //IF THERE IS NO ID RETURN EMPTY ARRAY...IF ID PRESENT RETURN THE MEAL ID
    return mealsid===null?[]:mealsid;
}


//FUNCTION FETCH FAVORITE MEAL
async function fetchFavMeal(){
    ulEl.innerHTML=``;
    const mealsid=getMealsFromLs();

    for(let i=0;i<mealsid.length;i++){
        const mealid=mealsid[i];
        const meal=await getMealById(mealid);
        addMealToFavorite(meal);
    }
}

function addMealToFavorite(mealData){
    //CREATE A NEW LIST ELEMENT
    const newListEl=document.createElement(`li`);
    newListEl.className=`favoritemeal`;
    newListEl.innerHTML=
    `<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear">X<button>`

    //FUNCTION TO DELETE AN UNWANTED FAVORITE ITEM...ADD EVENT LISTENER TO THE BUTTON
    const clearButton=newListEl.querySelector(`.clear`);
    clearButton.addEventListener(`click`,()=>{
        removeMealFromLs(mealData.idMeal);
        fetchFavMeal();
    })
    ulEl.appendChild(newListEl);

        
    


}

//FUNCTION TO FILTERSERCH ITEMS BASED ON SEARCH NAME..ADD EVENT LISTENER TO SEARCH BUTTON
filterButton.addEventListener(`click`,async ()=>{
    meals.innerHTML="";
    const valueinput=inputValue.value;
    const mealsSearched= await getMealBySearch(valueinput);
    if(mealsSearched===null){
        return alert(`Sorry..we dont have the meal you are looking for`)
    }else{

    }
    mealsSearched.forEach((meal)=>{
        loadRandomMeal(meal);
         
    }) 
    inputValue.value=``;
})






