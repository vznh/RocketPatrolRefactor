class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }

  create() {
    // place tile sprite
    this.starfield = this.add
      .tileSprite(0, 0, 640, 480, "starfield")
      .setOrigin(0, 0);

    // green UI background
    this.add
      .rectangle(
        0,
        borderUISize + borderPadding,
        game.config.width,
        borderUISize * 2,
        0x00ff00,
      )
      .setOrigin(0, 0);
    // white borders
    this.add
      .rectangle(0, 0, game.config.width, borderUISize, 0xffffff)
      .setOrigin(0, 0);
    this.add
      .rectangle(
        0,
        game.config.height - borderUISize,
        game.config.width,
        borderUISize,
        0xffffff,
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(0, 0, borderUISize, game.config.height, 0xffffff)
      .setOrigin(0, 0);
    this.add
      .rectangle(
        game.config.width - borderUISize,
        0,
        borderUISize,
        game.config.height,
        0xffffff,
      )
      .setOrigin(0, 0);

    // add rocket (p1)
    this.p1Rocket = new Rocket(
      this,
      game.config.width / 2,
      game.config.height - borderUISize - borderPadding,
      "rocket",
    ).setOrigin(0.5, 0);

    // add spaceships (x3)
    this.ship01 = new Spaceship(
      this,
      game.config.width + borderUISize * 6,
      borderUISize * 4,
      "spaceship",
      0,
      30,
    ).setOrigin(0, 0);
    this.ship02 = new Spaceship(
      this,
      game.config.width + borderUISize * 3,
      borderUISize * 5 + borderPadding * 2,
      "spaceship",
      0,
      20,
    ).setOrigin(0, 0);
    this.ship03 = new Spaceship(
      this,
      game.config.width,
      borderUISize * 6 + borderPadding * 4,
      "spaceship",
      0,
      10,
    ).setOrigin(0, 0);

    this.apollo01 = new Apollo(
      this,
      game.config.width,
      borderUISize * 5,
      "apollo",
      0,
      15
    );
    this.apollo02 = new Apollo(
      this,
      game.config.width,
      borderUISize * 6,
      "apollo",
      0,
      25
    );

    // define keys
    keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // initialize score
    this.p1Score = 0;

    // display score
    let scoreConfig = {
      fontFamily: "Courier",
      fontSize: "28px",
      backgroundColor: "#F3B141",
      color: "#843605",
      align: "right",
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100,
    };
    this.scoreLeft = this.add.text(
      borderUISize + borderPadding,
      borderUISize + borderPadding * 2,
      this.p1Score,
      scoreConfig,
    );

    // GAME OVER flag
    this.gameOver = false;

    // 60-second play clock
    scoreConfig.fixedWidth = 0;
    this.clock = this.time.delayedCall(
      game.settings.gameTimer,
      () => {
        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2,
            "GAME OVER",
            scoreConfig,
          )
          .setOrigin(0.5);
        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 + 64,
            "Press (R) to Restart or ← for Menu",
            scoreConfig,
          )
          .setOrigin(0.5);
        this.gameOver = true;
      },
      null,
      this,
    );

    this.particleEmitter = this.add.particles('explosion').createEmitter({
      speed:100,
      lifespan: 500,
      blendMode: 'ADD',
      frequency: -1,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, 0, 0)
      }
    });
  }

  update() {
    // check key input for restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
      this.scene.restart();
    }

    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      this.scene.start("menuScene");
    }

    this.starfield.tilePositionX -= 4;

    if (!this.gameOver) {
      this.p1Rocket.update(); // update rocket sprite
      this.ship01.update(); // update spaceships (x3)
      this.ship02.update();
      this.ship03.update();
      this.apollo01.update();
      this.apollo02.update();
    }

    let hitDetected = false;

    // check collisions
    const ships = [this.ship01, this.ship02, this.ship03];
    ships.forEach(ship => {
      if (this.checkCollision(this.p1Rocket, ship)) {
        this.p1Rocket.reset();
        this.shipExplode(ship);
        hitDetected = true;
      }
    })

    const apollos = [this.apollo01, this.apollo02];
    apollos.forEach(apollo => {
      if (this.checkCollision(this.p1Rocket, apollo)) {
        this.p1Rocket.reset();
        this.apolloExplode(apollo);
        hitDetected = true;
      }
    });

    if (!hitDetected) {
      game.settings.gameTimer -= 1000;

      if (game.settings.gameTimer < 0) {
        game.settings.gameTimer = 0;
      }
    }
  }

  checkCollision(rocket, ship) {
    // simple AABB checking
    if (
      rocket.x < ship.x + ship.width &&
      rocket.x + rocket.width > ship.x &&
      rocket.y < ship.y + ship.height &&
      rocket.height + rocket.y > ship.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  shipExplode(ship) {
    // temporarily hide ship
    ship.alpha = 0;
    // create explosion sprite at ship's position
    let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
    boom.anims.play("explode"); // play explode animation
    boom.on("animationcomplete", () => {
      // callback after anim completes
      ship.reset(); // reset ship position
      ship.alpha = 1; // make ship visible again
      boom.destroy(); // remove explosion sprite
    });
    // score add and text update
    this.p1Score += ship.points;
    game.settings.gameTimer += 5000;
    this.scoreLeft.text = this.p1Score;

    // add particle emitter
    this.particleEmitter.setPosition(ship.x, ship.y);
    this.particleEmitter.explode(30);

    this.sound.play("sfx-explosion");
  }

  apolloExplode(ship) {
    ship.alpha = 0;
    let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
    boom.anims.play("explode");
    boom.on("animationcomplete", () => {
      ship.reset();
      ship.alpha = 1;
      boom.destroy();
    });

    this.p1Score += ship.points * 2;
    game.settings.gameTimer += 7500;
    this.scoreLeft.text = this.p1Score;
    this.sound.play("sfx-explosion");
  }
}
