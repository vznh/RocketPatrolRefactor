// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this); // add to existing, displayList, updateList
    this.isFiring = false; // track rocket's firing status
    this.moveSpeed = 2; // rocket speed in pixels/frame

    this.sfxShot = scene.sound.add("sfx-shot");

    this.setInteractive();
    this.on('pointerdown', () => this.fire());
  }

  update() {
    // movement based on control type
    if (game.settings.controlType === 'keyboard') {
      if (!this.isFiring) {
        if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
          this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
          this.x += this.moveSpeed;
        }
      }
      if (Phaser.Input.Keyboard.JustDown(keyFIRE)) {
        this.fire();
      }
    } else if (game.settings.controlType === 'mouse') {
      this.x = this.scene.input.x; // Move to mouse position
      this.x = Phaser.Math.Clamp(this.x, borderUISize + this.width, game.config.width - borderUISize - this.width);

      if (this.scene.input.activePointer.isDown) {
        this.fire();
      }
    }

    // actively managing rocket movement when fired
    this.handleFiring();
  }


  // abstracted method
  fire() {
    if (!this.isFiring) {
      this.isFiring = true;
      this.sfxShot.play();
    }
  }

  handleFiring() {
    if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
      this.y -= this.moveSpeed;
    }

    if (this.y <= borderUISize * 3 + borderPadding) {
      this.reset();
    }
  }

  // reset rocket to "ground"
  reset() {
    this.isFiring = false;
    this.y = game.config.height - borderUISize - borderPadding;
  }
}
