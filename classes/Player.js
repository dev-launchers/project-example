import Phaser from "phaser";
import Character from "./Character.js";

export default class Player extends Character {
  constructor(scene, x, y) {
    super(scene, x, y);

    // Track the arrow keys & OPQA
    const {
      LEFT,
      RIGHT,
      UP,
      Q,
      O,
      P,
      A,
      D,
      W,
      S,
      DOWN
    } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      q: Q,
      o: O,
      p: P,
      a: A,
      d: D,
      w: W,
      s: S,
      down: DOWN
    });
  }

  update() {
    const keys = this.keys;
    //const sprite = this;
    const onGround = this.body.blocked.down;
    const cakeOnGround = this.scene.cake.body.blocked.down;
    const acceleration = onGround ? 260 : 150;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      this.setAccelerationX(-acceleration);
      this.setFlipX(true);
    } else if (keys.right.isDown || keys.d.isDown) {
      this.setAccelerationX(acceleration);
      this.setFlipX(false);
    } else {
      this.setAccelerationX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (onGround && (keys.up.isDown || keys.w.isDown)) {
      this.setVelocityY(-5000 * 2);
    }

    if (keys.down.isDown || keys.s.isDown) {
      this.setVelocityY(5000 * 2);
    }
    if (this.distanceAwayFromX(this.scene.cake.x) <= 30) {
      if (this.x < this.scene.cake.x && this.y === this.scene.cake.y) {
        if (onGround && cakeOnGround && this.body.velocity.y === 10000) {
          this.scene.cake.setVelocityY(-170);
          this.scene.cake.setVelocityX(200);
          this.particleSmash();
          this.scene.cameras.main.shake(500, 0.01);
        }
      }
    }
    if (this.distanceAwayFromX(this.scene.cake.x) >= -30) {
      if (this.x > this.scene.cake.x && this.y === this.scene.cake.y) {
        if (onGround && cakeOnGround && this.body.velocity.y === 10000) {
          this.scene.cake.setVelocityY(-170);
          this.scene.cake.setVelocityX(-200);
          this.particleSmash();
          this.scene.cameras.main.shake(500, 0.01);
        }
      }
    }

    // Update the animation/texture based on the state of the player
    /*
    if (onGround) {
      if (this.body.velocity.x !== 0) {
        this.anims.play("baker-idle", true);
      } else {
        this.anims.play("baker-idle", true);
      }
    } else {
      this.anims.stop();
      this.setTexture("baker", 4);
    }
    */
  }
  particleSmash() {
    const p = this.scene.add.particles("power");
    const emitter = p.createEmitter({
      x: this.x,
      y: this.y,
      speed: 200,
      lifespan: 100,
      blendMOde: "ADD",
      frequency: 50,
      alpha: { start: 1, end: 0 }
    });

    this.scene.time.delayedCall(200, () => {
      emitter.stop();
    });
  }

  distanceAwayFromX(targetX) {
    var distanceX = this.scene.cake.x - this.x;
    return distanceX;
  }

  destroy() {}
}
