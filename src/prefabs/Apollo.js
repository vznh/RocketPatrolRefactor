// Falls under the 5-Point Tier category.
// Inspiration taken from Apollo launches.
// ! NOTE NEEDS NEW TEXTURE SKIN
// Son J. W25 CMPM120

class Apollo extends Phase.GameObjects.Sprite {
  constructor(
    scene,
    x, y,
    texture,
    frame,
    pointValue
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.points = pointValue;
    this.moveSpeed = game.settings.apolloSpeed;
  }

  update() {
    this.x -= this.moveSpeed;

    if (this.x <= 0 - this.width) {
      this.x = game.config.width;
    }
  }

  reset() {
    this.x = game.config.width;
  }
}
