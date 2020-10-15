import Phaser from 'phaser';
import Enemy from '../Objects/Enemy';
import PlayerCharacter from '../Objects/PlayerCharacter';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }
  create() {
    // change the background to green
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();
    // on wake event we call startBattle too
    this.sys.events.on('wake', this.startBattle, this);
  }
  startBattle() {
    this.world = this.scene.get('World');
    const warrior = new PlayerCharacter(
      this,
      (config.width * 3) / 4,
      (config.height * 1) / 3,
      'player',
      1,
      'Warrior',
      [100, 110],
      [this.world.player.damage, this.world.player.damage + 20],
    );

    this.add.existing(warrior);


    const dragonblue = new Enemy(
      this,
      config.width / 4,
      (config.height * 1) / 3,
      this.world.player.enemy.texture,
      null,
      this.world.player.enemy.name,
      this.world.player.enemy.hp,
      this.world.player.enemy.damage,
    );
    this.add.existing(dragonblue);

    // var dragonOrange = new Enemy(
    //   this,
    //   50,
    //   100,
    //   'dragonorange',
    //   null,
    //   'Dragon2',
    //   10,
    //   3
    // );
    // this.add.existing(dragonOrange);
    // array with heroes
    this.heroes = [warrior]; //[warrior, mage]
    // array with enemies
    this.enemies = [dragonblue]; //[dragonblue, dragonOrange]
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies);

    this.index = -1; // currently active unit

    this.scene.run('UI');
  }
  nextTurn() {
    // if we have victory or game over
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      // currently active unit
      this.index++;
      // if there are no more units, we start again from the first one
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);
    // if its player hero
    if (this.units[this.index] instanceof PlayerCharacter) {
      // we need the player to select action and then enemy
      this.events.emit('PlayerSelect', this.index);
    } else {
      // else if its enemy unit
      // pick random living hero to be attacked
      var r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
      // call the enemy's attack function
      this.units[this.index].attack(this.heroes[r]);
      // add timer for the next turn, so will have smooth gameplay
      this.events.emit('UpdateHealthBars');

      this.time.addEvent({
        delay: 3000,
        callback: this.nextTurn,
        callbackScope: this,
      });
    }
  }
  // check for ame over or victory
  checkEndBattle() {
    var victory = true;
    // if all enemies are dead we have victory
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) victory = false;
    }
    var gameOver = true;
    // if all heroes are dead we have game over
    for (var i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].living) gameOver = false;
    }
    if (gameOver) {
      this.world.finishGame();
    }
    return victory || gameOver;
  }
  // when the player hae selected the enemy to be attacked
  receivePlayerSelection(action, target) {
    if (action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.events.emit('UpdateHealthBars');

    // next turn in 3 seconds
    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this,
    });
  }
  endBattle() {
    // clear state, remove sprites
    this.events.emit('DeleteHealthBars');

    // sleep the UI
    this.scene.sleep('UI');
    // return to WorldScene and sleep current BattleScene
    this.scene.switch('World');
    this.world = this.scene.get('World');
    this.world.updateScore(10);
  }
}
