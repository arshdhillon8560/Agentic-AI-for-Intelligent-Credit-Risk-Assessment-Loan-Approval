function generateApplicationId(){

 const random = Math.floor(Math.random() * 1000000)

 return "APP" + Date.now() + random

}

module.exports = generateApplicationId