import Phaser from 'phaser';

export default class Unit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, type, hp, damage) {
    super(scene, x, y, texture, frame, type, hp, damage);
    this.type = type;

    this.hp = Phaser.Math.RND.between(hp[0], hp[1]);
    this.maxHp = this.hp;
    this.damage = () => Phaser.Math.RND.between(damage[0], damage[1]);
    this.living = true;
    this.setScale(2);
  }

  

  attack(target) {
    if (target.living) {
      const damage = this.damage();
      target.takeDamage(damage);
      this.scene.events.emit(
        'Message',
        `${this.type} attacks ${target.type} for ${damage} damage`,
      );
    }
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      
      this.living = false;
      this.visible = false;
        }
  }
}
