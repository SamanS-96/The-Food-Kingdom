console.log("js loaded!");
AOS.init();

let mealName=document.getElementById("meal_name");
let mealCategory=document.getElementById("meal_category");
let mealArea=document.getElementById("meal_area");
let mealTags=document.getElementById("meal_tags");
let mealIns=document.getElementById("meal_ins");

async function loadRandomMeal() {

    await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        //console.log(data);

        // elements that should animate
        const elements = [mealName, mealCategory, mealArea, mealTags, mealIns, meal_img];

        // Remove old animation & retrigger
        elements.forEach(el => {
            el.classList.remove("animate");
            void el.offsetWidth; // restart animation trick
        });

        // Update data
        mealName.innerText = data.meals[0].strMeal;
        mealCategory.innerText = data.meals[0].strCategory;
        mealArea.innerText = "- " + data.meals[0].strArea;
        mealTags.innerText = data.meals[0].strTags;
        mealIns.innerText = data.meals[0].strInstructions;
        meal_img.src = data.meals[0].strMealThumb;

        // Add animation again
        elements.forEach(el => {
            el.classList.add("animate");
        });

    });
}

// initial load
loadRandomMeal();

// auto change every 20s
setInterval(loadRandomMeal, 20000);



//--Menu Page Functions----------------------------------

let input=document.getElementById("search_meal");

input.addEventListener("keypress",e=>{
    if(e.key==="Enter"){
        searchMeal(input.value);
        input.value="";
    }
});

async function searchMeal(mealInput) {
    let res=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealInput}`);
    let data=await res.json();
    // console.log(data);
    if (!data.meals) {
        alert("Meal not found!");
        return;
    }
    setMealDetails(data);
}

function setMealDetails(data){
    let name=document.getElementById("name");
    let category=document.getElementById("category");
    let area=document.getElementById("area");
    let tags=document.getElementById("tags");
    let lbl_ingredients=document.getElementById("lbl_ingredients");
    let lbl_instructions=document.getElementById("lbl_instructions");

    // elements that should animate
    const elements = [name, category, area, tags, img, meal_video, lbl_ingredients, lbl_instructions];

    // Remove old animation & retrigger
    elements.forEach(el => {
        el.classList.remove("animate");
        void el.offsetWidth; // restart animation trick
    });

    //********update data------------***************************************
    name.innerText = data.meals[0].strMeal;
    category.innerText = data.meals[0].strCategory;
    area.innerText = "- " + data.meals[0].strArea;
    tags.innerText = data.meals[0].strTags;

    img.src = data.meals[0].strMealThumb;

    // ---- YOUTUBE FIX ----
    const youtubeURL = data.meals[0].strYoutube;
    const videoID = youtubeURL.split("v=")[1];       // Extract ID
    const embedURL = `https://www.youtube.com/embed/${videoID}`;
    meal_video.src = embedURL;

    lbl_instructions.innerText=data.meals[0].strInstructions;
    
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        let ingredient = data.meals[0][`strIngredient${i}`];
        let measure = data.meals[0][`strMeasure${i}`];

        // Stop when there are no more ingredients
        if (!ingredient || ingredient.trim() === "") break;

        ingredients += `${ingredient} - (${measure})  ,  `;
    }

    lbl_ingredients.innerText = ingredients;

    //**********------ *************************************************
    
    // Add animation again
    elements.forEach(el => {
        el.classList.add("animate");
    });

}



