import Phaser from 'phaser';
import config from '../Config/config';
import Enemy from '../Objects/Enemy';
import PlayerCharacter from '../Objects/PlayerCharacter';
import OperationsAPI from '../Message/OperationsAPI';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();
    this.ui = this.scene.get('UI');
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
      [this.world.player.damage, this.world.player.damage + 20]
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
      this.world.player.enemy.damage
    );
    this.add.existing(dragonblue);
    this.heroes = [warrior];
    this.enemies = [dragonblue];
    this.units = this.heroes.concat(this.enemies);
    this.index = -1;
    this.scene.run('UI');
  }

  attackEnemy() {
    // if (action === 'attack') {
    this.units[0].attack(this.units[1]);
    // }
    this.events.emit('UpdateHealthBars');

    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this,
    });
  }

  nextTurn() {
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    this.units[1].attack(this.units[0]);

    this.events.emit('UpdateHealthBars');

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.checkEndBattle();
        this.ui.attackButton.visibleToggle();
      },
    });
  }

  checkEndBattle() {
    let victory = 'victory';

    if (this.enemies[0].living) {
      victory = false;
    } else {
      this.endBattle();
      return;
    }

    let gameOver = 'game over';

    for (let i = 0; i < this.heroes.length; i += 1) {
      if (this.heroes[i].living) gameOver = false;
    }

    if (gameOver) {
      this.events.emit('DeleteHealthBars');
      this.ui.attackButton.destroy();
      this.scene.sleep('UI');
      this.finishGame();
    }
    return victory || gameOver;
  }

  finishGame() {
    (async () => {
      OperationsAPI.update(
        this.sys.game.globals.username,
        this.world.player.score
      ).then(() => {
        this.scene.start('Score');
      });
    })();
  }

  endBattle() {
    this.events.emit('DeleteHealthBars');
    this.scene.sleep('UI');
    this.scene.switch('World');
    this.world.winGame();
  }
}
