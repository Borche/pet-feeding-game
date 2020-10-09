// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {
  // game stats
  this.stats = {
    health: 15,
    fun: 100
  };

  // decary params
  this.decayRates = {
    health: -5,
    fun: -2
  };
};

// executed once, after assets were loaded
gameScene.create = function () {
  console.log('Game#create');

  this.isGameOver = false;

  let bg = this.add.sprite(0, 0, 'backyard').setInteractive().setOrigin(0, 0);

  // event listener for the background
  bg.on('pointerdown', this.placeItem, this);

  this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive();

  // make pet draggable (listen to drag events)
  this.input.setDraggable(this.pet);

  // follow pointer/finger when dragging
  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    // make sprite be located at the coords of the dragging
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  // create ui
  this.createUI();

  this.createHud();
  this.refreshHud();

  // decay of heath and fun over time
  this.timedEventStats = this.time.addEvent({
    delay: 1000,
    repeat: -1, // repeat forever
    callbackScope: this,
    callback: function () {
      this.updateStats(this.decayRates);
    }
  });
};

gameScene.createUI = function () {
  // buttons
  this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
  this.appleBtn.customStats = { health: 20, fun: 0 };
  this.appleBtn.on('pointerdown', this.pickItem);

  this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
  this.candyBtn.customStats = { health: -10, fun: 10 };
  this.candyBtn.on('pointerdown', this.pickItem);

  this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
  this.toyBtn.customStats = { health: 0, fun: 15 };
  this.toyBtn.on('pointerdown', this.pickItem);

  this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
  this.rotateBtn.customStats = { fun: 20 };
  this.rotateBtn.on('pointerdown', this.rotatePet);

  // array with all buttons
  this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

  // ui is not blocked
  this.uiBlocked = false;

  // refresh ui
  this.uiReady();
};

// rotate pet
gameScene.rotatePet = function () {
  if (this.scene.uiBlocked) return;

  // make sure the ui is ready
  this.scene.uiReady();

  // block the ui
  this.scene.uiBlocked = true;

  // dim rotate btn
  this.alpha = 0.5;

  // rotation tween
  this.scene.tweens.add({
    targets: this.scene.pet,
    duration: 600,
    angle: 360,
    pause: false,
    callbackScope: this,
    onComplete: function (tween, sprites) {
      // update fun
      this.scene.updateStats(this.customStats);

      // set UI to ready
      this.scene.uiReady();

      console.log(this.scene.stats);
    }
  });
};

gameScene.pickItem = function () {
  if (this.scene.uiBlocked) return;

  // make sure the ui is ready
  this.scene.uiReady();

  // select item
  this.scene.selectedItem = this;

  // change transparency
  this.alpha = 0.5;

  console.log('We picked ' + this.texture.key);
};

// set ui to "ready"
gameScene.uiReady = function () {
  // nothing is being selected
  this.selectedItem = null;

  // set all buttons to alpha 1
  this.buttons.forEach(btn => (btn.alpha = 1));

  this.uiBlocked = false;
};

gameScene.placeItem = function (pointer, localX, localY) {
  // check that an item was selected
  if (!this.selectedItem) return;

  if (this.uiBlocked) return;

  // create a new item in the position the player clicked/tapped
  let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

  this.uiBlocked = true;

  // pet movement (tween)
  this.tweens.add({
    targets: this.pet,
    duration: 500,
    x: newItem.x,
    y: newItem.y,
    paused: false,
    callbackScope: this,
    onComplete: function (tween, sprites) {
      // play spritesheet animation
      this.pet.play('funnyfaces');

      // event listener for when spritesheet animation ends
      this.pet.on(
        'animationcomplete',
        function () {
          this.pet.setFrame(0);

          // clear ui
          this.uiReady();
        },
        this
      );

      // setTimeout(() => newItem.destroy(), 400);
      newItem.destroy();

      this.updateStats(this.selectedItem.customStats);
    }
  });
};

gameScene.createHud = function () {
  // health stat
  this.healthText = this.add.text(20, 20, 'Health: ', {
    font: '20px Arial',
    fill: '#ffffff'
  });

  this.funText = this.add.text(160, 20, 'Fun: ', {
    font: '20px Arial',
    fill: '#ffffff'
  });
};

gameScene.refreshHud = function () {
  this.healthText.setText('Health: ' + this.stats.health);
  this.funText.setText('Fun: ' + this.stats.fun);
};

gameScene.updateStats = function (statsDiff) {
  if (this.isGameOver) return;

  // update pet stats
  for (stat in statsDiff) {
    if (statsDiff.hasOwnProperty(stat)) {
      this.stats[stat] += statsDiff[stat];

      if (this.stats[stat] <= 0) {
        this.isGameOver = true;
        this.stats[stat] = 0;
      }
    }
  }

  this.refreshHud();

  if (this.isGameOver) this.gameOver();
};

gameScene.gameOver = function () {
  // block ui
  this.uiBlocked = true;

  // change frame of the pet
  this.pet.setFrame(4);

  // keep the game on for some time and then move on
  this.time.addEvent({
    delay: 2000,
    repeat: 0, // don't repeat
    callbackScope: this,
    callback: function () {
      this.scene.start('Home');
    }
  });
};
