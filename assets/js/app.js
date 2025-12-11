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


//-----------------------------------------------------------------
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


let btnDiscover=document.getElementById("discover_meal");
btnDiscover.addEventListener("click",e=>{
    discoverMeal();
});

async function discoverMeal() {
    let res=await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    let data=await res.json();
    setMealDetails(data);
}
// initial load
discoverMeal();


function setMealDetails(data){
    let name=document.getElementById("name");
    let category=document.getElementById("category");
    let area=document.getElementById("area");
    let tags=document.getElementById("tags");
    let lbl_ingredients=document.getElementById("lbl_ingredients");
    let lbl_instructions=document.getElementById("lbl_instructions");

    // elements that should animate
    const elements = [name, category, area, tags, img, meal_video, lbl_ingredients, lbl_instructions,];

    // Remove old animation & retrigger
    elements.forEach(el => {
        el.classList.remove("animate");
        void el.offsetWidth; // restart animation trick
    });

    //********update data------------***************************************
    name.innerText = data.meals[0].strMeal;
    category.innerText = data.meals[0].strCategory;
    area.innerText = data.meals[0].strArea;
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


//Filter Section-------------------------------------------------------

let selectedOp = document.getElementById("option_select");
let DisplayOp = document.getElementById("lbl_option");

selectedOp.addEventListener("change", e => {
    const value = e.target.value; // or selectedOp.value

    if (value === "Category") {
        DisplayOp.innerText = "Please Select Category ! ---------->";
        loadCategories();
    } else if (value === "Area") {
        DisplayOp.innerText = "Please Select Area ! ---------->";
        loadAreas();
    } else if (value === "Main Ingredient") {
        DisplayOp.innerText = "Please Select Ingredient ! ---------->";
        loadIngredients();
    } else {
        DisplayOp.innerText = "";
        option_filter.innerHTML = "";
    }
});


async function loadCategories() {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    let data = await res.json();

    let select = document.getElementById("option_filter");

    select.innerHTML = `<option value="">--Select Category--</option>`; // clear previous options

    data.meals.forEach(item => {
        let option = document.createElement("option");
        option.value = item.strCategory;
        option.textContent = item.strCategory;
        select.appendChild(option);
    });
}

async function loadAreas() {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let data = await res.json();

    let select = document.getElementById("option_filter");

    select.innerHTML = `<option value="">--Select Area--</option>`; // clear previous options

    data.meals.forEach(item => {
        let option = document.createElement("option");
        option.value = item.strArea;
        option.textContent = item.strArea;
        select.appendChild(option);
    });
}

async function loadIngredients() {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    let data = await res.json();

    let select = document.getElementById("option_filter");

    select.innerHTML = `<option value="">--Select Ingredient--</option>`; // clear previous options

    data.meals.forEach(item => {
        let option = document.createElement("option");
        option.value = item.strIngredient;
        option.textContent = item.strIngredient;
        select.appendChild(option);
    });
}

//Filter Meals--------------------------------------------

window.onload = function () {
    document.getElementById("option_select").value = "";
};

document.getElementById("btn_filter").addEventListener("click", () => {
    
    let type = document.getElementById("option_select").value;
    let filterValue = document.getElementById("option_filter").value;

    if (!type || !filterValue) {
        alert("Please select both filter options!");
        return;
    }

    filterMeals(type, filterValue);
    
});

async function filterMeals(type, value) {
    // elements that should animate
    const elements = [filterResults];

    // Remove old animation & retrigger
    elements.forEach(el => {
        el.classList.remove("animate");
        void el.offsetWidth; // restart animation trick
    });


    let url = "";

    if (type === "Category") {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}`;
    }
    else if (type === "Area") {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}`;
    }
    else if (type === "Main Ingredient") {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${value}`;
    }

    let res = await fetch(url);
    let data = await res.json();

    let container = document.getElementById("filterResults");
    container.innerHTML = ""; // clear previous

    if (!data.meals) {
        container.innerHTML = "<p>No meals found.</p>";
        return;
    }

    data.meals.forEach(meal => {
        let div = document.createElement("div");
        div.classList.add("meal-item");

        div.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <span>${meal.strMeal}</span>
        `;

        // Click → show details
        div.addEventListener("click", () => {
            searchMeal(meal.strMeal);
        });

        container.appendChild(div);
    });

    // Add animation again
    elements.forEach(el => {
        el.classList.add("animate");
    });
}




