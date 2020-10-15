import Phaser from 'phaser';
import config from '../Config/config';
import Enemy from '../Objects/Enemy';
import PlayerCharacter from '../Objects/PlayerCharacter';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();

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

    this.heroes = [warrior];

    this.enemies = [dragonblue];

    this.units = this.heroes.concat(this.enemies);

    this.index = -1;

    this.scene.run('UI');
  }

  nextTurn() {
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      this.index += 1;

      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index] instanceof PlayerCharacter) {
      this.events.emit('PlayerSelect', this.index);
    } else {
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);

      this.units[this.index].attack(this.heroes[r]);

      this.events.emit('UpdateHealthBars');

      this.time.addEvent({
        delay: 3000,
        callback: this.nextTurn,
        callbackScope: this,
      });
    }
  }

  checkEndBattle() {
    let victory = true;

    for (let i = 0; i < this.enemies.length; i += 1) {
      if (this.enemies[i].living) victory = false;
    }
    let gameOver = true;

    for (let i = 0; i < this.heroes.length; i += 1) {
      if (this.heroes[i].living) gameOver = false;
    }
    if (gameOver) {
      this.world.finishGame();
    }
    return victory || gameOver;
  }

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.events.emit('UpdateHealthBars');

    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this,
    });
  }

  endBattle() {
    this.events.emit('DeleteHealthBars');

    this.scene.sleep('UI');

    this.scene.switch('World');
    this.world.winGame();
  }
}
