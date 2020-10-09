// create a new scene
let loadingScene = new Phaser.Scene('Loading');

// load asset files for our game
// When you load assets in one scene, they are available in all other scenes
loadingScene.preload = function () {
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  // show logo
  let logo = this.add.sprite(gameW / 2, 250, 'logo');

  // progress bar background
  let bgBar = this.add.graphics();

  let barW = 150;
  let barH = 30;

  bgBar.setPosition(gameW / 2 - barW / 2, gameH / 2 - barH / 2);
  bgBar.fillStyle(0xf5f5f5, 1);
  bgBar.fillRect(0, 0, barW, barH);

  // progress bar
  let progressBar = this.add.graphics();

  progressBar.setPosition(gameW / 2 - barW / 2, gameH / 2 - barH / 2);

  this.load.on(
    'progress',
    function (value) {
      // clearing progress bar (so we can draw it again)
      progressBar.clear();

      // set style
      progressBar.fillStyle(0x9ad98d);
      progressBar.fillRect(0, 0, value * barW, barH);
    },
    this
  );

  // load assets
  this.load.image('backyard', 'assets/images/backyard.png');
  this.load.image('apple', 'assets/images/apple.png');
  this.load.image('candy', 'assets/images/candy.png');
  this.load.image('rotate', 'assets/images/rotate.png');
  this.load.image('toy', 'assets/images/rubber_duck.png');

  // load spritesheet
  this.load.spritesheet('pet', 'assets/images/pet.png', {
    frameWidth: 97,
    frameHeight: 83,
    margin: 1,
    spacing: 1
  });

  // Fake loading bar with many image loads, so that it doesn't fill so quickly
  // for (let i = 0; i < 1200; i++) {
  //   this.load.image('test' + i, 'assets/images/candy.png');
  // }
};

loadingScene.create = function () {
  console.log('Loading#create');

  // animation
  this.anims.create({
    key: 'funnyfaces',
    frames: this.anims.generateFrameNames('pet', { frames: [1, 2, 3] }),
    frameRate: 7,
    yoyo: true,
    repeat: 0
  });

  this.scene.start('Home');
};
