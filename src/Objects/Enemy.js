// import Unit from './Unit';

// var Enemy = new Phaser.Class({
//   Extends: Unit,

//   initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
//     Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
//   },
// });
// export default Enemy;

import Unit from './Unit';

export default class Enemy extends Unit {
  constructor(scene, x, y, texture, frame, type, hp, damage) {
    super(scene, x, y, texture, frame, type, hp, damage);
    this.flipX = true;
    this.setScale(2);
  }
  // attack(target) {
  //   target.takeDamage(this.damage);
  // }
  // takeDamage(damage) {
  //   this.hp -= damage;
  // }
}
