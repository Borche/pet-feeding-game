// create a new scene
let homeScene = new Phaser.Scene('Home');

homeScene.create = function () {
  console.log('Home#create');

  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  // game background, with active input
  let bg = this.add.sprite(0, 0, 'backyard').setInteractive().setOrigin(0, 0);

  // welcome text
  let text = this.add
    .text(gameW / 2, gameH / 2, 'VIRTUAL PET', {
      font: '40px Arial',
      fill: '#95ff87'
    })
    .setOrigin(0.5, 0.5);
  text.setShadow(3, 3, '#000000', 5);

  let subtext = this.add
    .text(gameW / 2 - 99, gameH / 2 + 50, 'Objetivo:', {
      font: '20px Arial',
      fill: '#ffffff'
    })
    .setOrigin(0.5, 0.5);
  subtext.setShadow(3, 3, '#000000', 5);

  let subtext2 = this.add
    .text(
      gameW / 2,
      gameH / 2 + 80,
      'Mantenga el salud (health) y diversion \n(fun) de tu mascota, o va a morir...',
      {
        font: '16px Arial',
        fill: '#ffffff'
      }
    )
    .setOrigin(0.5, 0.5);
  subtext2.setShadow(3, 3, '#000000', 5);

  // text background
  let textBg = this.add.graphics();
  let margin = 20;
  textBg.fillStyle(0x000000, 0.7);
  textBg.fillRect(
    gameW / 2 - text.width / 2 - margin,
    gameH / 2 - text.height / 2 - margin,
    text.width + 2 * margin,
    text.height + 2 * margin + 75
  );

  text.depth = 1;
  subtext.depth = 1;
  subtext2.depth = 1;

  bg.on(
    'pointerdown',
    function () {
      this.scene.start('Game');
    },
    this
  );
};
