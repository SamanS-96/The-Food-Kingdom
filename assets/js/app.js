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

// auto change every 10s
setInterval(loadRandomMeal, 20000);


