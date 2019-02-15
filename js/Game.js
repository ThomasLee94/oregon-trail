// Game.js
// eslint-disable-next-line no-var


class Game {
  constructor({
    weightOx=20, weightPerson=2, weightFood=0.6, fpWeight=5, gameSpeed=800,
    dayStep=0.2, foodPerson = 0.02, fullSpeed = 5, slowSpeed=3, finalDistance=1000,
    eventProb=0.15, enemyFpAvg=5, enemyGoldAvg=50
  }) {
    this.WEIGHT_PER_OX = weightOx;
    this.WEIGHT_PER_PERSON = weightPerson;
    this.FOOD_WEIGHT = weightFood;
    this.FIREPOWER_WEIGHT = fpWeight;
    this.GAME_SPEED = gameSpeed;
    this.DAY_PER_STEP = dayStep;
    this.FOOD_PER_PERSON = foodPerson;
    this.FULL_SPEED = fullSpeed;
    this.SLOW_SPEED = slowSpeed;
    this.FINAL_DISTANCE = finalDistance;
    this.EVENT_PROBABILITY = eventProb;
    this.ENEMY_FIREPOWER_AVG = enemyFpAvg;
    this.ENEMY_GOLD_AVG = enemyGoldAvg;
    this.init();
  }

  // initiate the game
  init() {
    // reference ui
    this.ui = Ui.ui;

    // reference event manager
    this.eventManager = Event.event;

    // setup caravan
    this.caravan = OregonH.Caravan;
    this.caravan.init({
      day: 0,
      distance: 0,
      crew: 30,
      food: 80,
      oxen: 2,
      money: 300,
      firepower: 2,
    });

    // pass references
    this.caravan.ui = this.ui;
    this.caravan.eventManager = this.eventManager;

    this.ui.game = this;

    this.ui.caravan = this.caravan;
    this.ui.eventManager = this.eventManager;

    this.eventManager.game = this;
    this.eventManager.caravan = this.caravan;
    this.eventManager.ui = this.ui;

    // begin adventure!
    this.startJourney();
  };

  // ======== START JOURNEY WITH TIME RUNNING ========
  startJourney() {
    this.gameActive = true;
    this.previousTime = null;
    this.ui.notify('A great adventure begins', 'positive');

    this.step();
  };

  // ======== GAME LOOP ========
  step(timestamp) {
    // starting, setup the previous time for the first time
    if (!this.previousTime) {
      this.previousTime = timestamp;
      this.updateGame();
    }
    // time difference
    const progress = timestamp - this.previousTime;
    // game update
    if (progress >= OregonH.GAME_SPEED) {
      this.previousTime = timestamp;
      this.updateGame();
    }
    // we use "bind" so that we can refer to the context "this" inside of the step method
    if (this.gameActive) window.requestAnimationFrame(this.step.bind(this));
  }

  // ======== UPDATE GAME STATS ========
  updateGame() {
    // DAY UPDATE
    this.caravan.day += OregonH.DAY_PER_STEP;

    // FOOD CONSUMPTION 
    this.caravan.consumeFood();

    // GAME OVER NO FOOD
    if (this.caravan.food === 0) {
      this.ui.notify('Your caravan starved to death', 'negative');
      this.gameActive = false;
      return;
    }

    // UPDATE WEIGHT
    this.caravan.updateWeight();

    // UPDATE PROGRESS
    this.caravan.updateDistance();

    // SHOW STATS
    this.ui.refreshStats();

    // CHECK IF EVERYONE DIED
    if (this.caravan.crew <= 0) {
      this.caravan.crew = 0;
      this.ui.notify('Everyone died', 'negative');
      this.gameActive = false;
      return;
    }

    // CHECK WIN GAME 
    if (this.caravan.distance >= OregonH.FINAL_DISTANCE) {
      this.ui.notify('You have returned home!', 'positive');
      this.gameActive = false;
      return;
    }

    // RANDOM EVENTS
    if (Math.random() <= OregonH.EVENT_PROBABILITY) {
      this.eventManager.generateEvent();
    }
  };

  // ======== GAME PAUSE ========
  pauseJourney() {
    this.gameActive = false;
  };

  // ======== RESUME JOURNEY ========
  resumeJourney() {
    this.gameActive = true;
    this.step();
  };
}



// init game
OregonH.Game.init();


// class Game {
//   constructor() {
//     this.caravan = new Caravan()
//     this.ui = new UI()
//   }
// }

// new Game()