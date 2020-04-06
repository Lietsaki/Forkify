import axios from "axios";

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }catch(error){
            console.log(error);
            alert("Something went wrong :(");
        }
    }
    calcTime(){
        // Assuming that we need 15 minutes for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds" ];
        const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"];
        const units = [...unitsShort, "kg", "g"];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => { // "unit" is the current element and "i" is the current index
            ingredient = ingredient.replace(unit, unitsShort[i])
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); // This is called a regular expression

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(" "); // Splitting it by an empty space, every word will become a new object in the array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)) // Test if every passed in element is in the unitsShort array

            let objIng;
            if(unitIndex > -1){ 
                // 1) There's a unit
                // Ex. "4 1/2 cups", arrCount will be [4, 1/2] ---> "4+1/2" ---> eval("4+1/2") ---> 4.5
                // Ex. "4 cups", arrCount will be [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                // First, we'll need a function to turn string fractions into numbers with decimals
                const fractionStrToDecimal = str => str.split('/').reduce((p, c) => p / c);
                // And a function to round decimals to two
                function roundToTwo(num) {    
                    return +(Math.round(num + "e+2")  + "e-2");
                }
                if(arrCount.length === 1){
                    // count = eval(arrIng[0].replace("-", "+")); // We shouldn't use eval, so there's and alternative down there

                    if(arrIng[0].length === 5){ // x-x/x strings have a length of 5
                   // In case the first number is something like 1-1/3, then we want to sum the numbers divided by the dash.
                   // We extract every number in an individual string
                   const num1 = arrIng[0].slice(0,1); // "1"
                   const num2 = arrIng[0].slice(2,5); // "1/3"
                   // And turn those strings into numbers
                   const parsed1 = parseInt(num1, 10); // 1;
                   const parsed2 = fractionStrToDecimal(num2); // 0.3333333333333333
                   const parsed2rounded = roundToTwo(parsed2); // 0.33

                   // Finally, we sum them
                   count = parsed1 + parsed2rounded;// Non eval solution

                    }else if(arrIng[0].length === 3){ // if the first number is something like 1/3 
                        count = roundToTwo(fractionStrToDecimal(arrIng[0]));
                    }
                    else if(arrIng[0].length === 1 && isNaN(arrIng[0]) === false ){ // if we have a single number, like 3
                        count = parseInt(arrIng[0], 10);
                    }
                    else{ // in case the value is expressed as a weird string character, like ½
                        count = 0.72;
                    }
              
                }else if(arrCount.length === 2) { // This is in case we have something like "2 1/4 teaspoons active dry yeast"
                    // count = eval(arrIng.slice(0, unitIndex).join("+")); // We should NEVER use eval as it can lead to security issues
                    const firstNum = parseInt(arrIng[0], 10); // 2
                    const fractionResult = roundToTwo(fractionStrToDecimal(arrIng[1])); // 1/4 ---> 0.25
                    const arrSum = firstNum + fractionResult; // 2 + 0.25 = 2.25
                    count = arrSum; // 2.25 | Non eval solution 
                }else {
                    count = arrIng[0] + arrIng[1];
                }

                objIng = {
                    count, 
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(" ")
                };

            }else if(parseInt(arrIng[0], 10)) { 
                // 2) There's no unit, but the first element of the array is a number. Here we transform the first element in the arrIng array 
                // into a number, if it's successfull then we've got a number like in "1 bread"
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: "",                   // There's no unit 
                    ingredient: arrIng.slice(1).join(" ") // All the array except the number
                }
            }else if(unitIndex === -1){
                // 3) There's no unit and no number in the first position
                objIng = {
                    count: 1, // We have to put something here, so 1 is the best choice. Ex: "Tomato sauce", it'd be 1 tomato sauce
                    unit: "", // The unit is empty because there's no unit
                    ingredient 
                    // This means ingredient: ingredient (it comes from the let variable that
                    // we created from array of ingredients we passed into .map, but lower cased).
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
    
    updateServings (type) {
        // Servings
        const newServings = type === "dec" ? this.servings -1 : this.servings + 1; 

        // Ingredients
        this.ingredients.forEach(ingredient => {
            ingredient.count = ingredient.count * (newServings / this.servings); // 
        });
        this.servings = newServings;
    }
}