// Caravan.js
// eslint-disable-next-line no-var
class Caravan {
  constructor({
    day, distance, crew, food, oxen, money, firepower,
  }) {
    this.WEIGHT_PER_OX = 20;
    this.WEIGHT_PER_PERSON = 2;
    this.WEIGHT_OF_FOOD = 0.6;
    this.WEIGHT_OF_FIREPOWER = 5;
    this.GAME_SPEED = 800;
    this.DAY_PER_STEP = 0.2;
    this.FOOD_PER_PERSON = 0.02;
    this.FULL_SPEED = 5;
    this.SLOW_SPEED = 3;
    this.FINAL_DISTANCE = 1000;
    this.EVENT_PROBABILITY = 0.15;
    this.ENEMY_FIREPOWER_AVG = 5;
    this.ENEMY_GOLD_AVG = 50;
    this.day = day;
    this.distance = distance;
    this.crew = crew;
    this.food = food;
    this.oxen = oxen;
    this.money = money;
    this.firepower = firepower;
  }

  updateWeight() {
    let droppedFood = 0;
    let droppedGuns = 0;
    // how much can the caravan carry
    this.capacity = this.oxen * this.WEIGHT_PER_OX + this.crew * this.WEIGHT_PER_PERSON;
    // how much weight do we currently have
    this.weight = this.food * this.WEIGHT_OF_FOOD + this.firepower * this.WEIGHT_OF_FIREPOWERT;
    // drop things behind if it's too much weight
    // assume guns get dropped before food
    while (this.firepower && this.capacity <= this.weight) {
      this.firepower -= 1;
      this.weight -= this.WEIGHT_OF_FIREPOWERT;
      droppedGuns += 1;
    }

    if (droppedGuns) {
      this.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
    }

    while (this.food && this.capacity <= this.weight) {
      this.food -= 1;
      this.weight -= this.WEIGHT_OF_FOOD;
      droppedFood += 1;
    }

    if (droppedFood) {
      this.ui.notify(`Left ${droppedFood} food provisions behind`, 'negative');
    }
  }

  updateDistance() {
    // the closer to capacity, the slower
    const diff = this.capacity - this.weight;
    const speed = this.SLOW_SPEED + diff / this.capacity * this.FULL_SPEED;
    this.distance += speed;
  }

  // food consumption
  consumeFood() {
    this.food -= this.crew * this.FOOD_PER_PERSON;
  
    if (this.food < 0) {
      this.food = 0;
    }
  }
}

// INIT CARAVAN
const caravan = new Caravan({day: 0,distance: 0, crew: 30, food: 80, oxen: 2, money: 300,firepower: 2,})
