/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import Message from '../Message/Message';
import ActionButton from '../Objects/ActionButton';
import config from '../Config/config';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create() {
    this.battle = this.scene.get('Battle');
    this.sys.events.on('wake', this.afterWake, this);
    this.message = new Message(this, this.battle.events);
    this.add.existing(this.message);
    this.afterWake();
  }

  afterWake() {
    this.attackButton = new ActionButton(
      this,
      config.width / 2,
      config.height / 2,
      'blueButton1',
      'blueButton2',
      'attack',
      () => {
        this.battle.attackEnemy();
        this.attackButton.visibleToggle();
      }
    );
    this.addHealthBars();
  }

  addHealthBars() {
    this.healthBar = {
      warrior: { unit: this.battle.heroes[0] },
      bluedragon: { unit: this.battle.enemies[0] },
    };
    this.healthBar.warrior.bar = this.makeBar(this.healthBar.warrior, 0x2ecc71);

    this.healthBar.bluedragon.bar = this.makeBar(
      this.healthBar.bluedragon,
      0x2ecc71
    );

    this.battle.events.on('UpdateHealthBars', this.updateBars, this);
    this.battle.events.on('DeleteHealthBars', this.deleteBars, this);
  }

  makeBar(unit, color) {
    const bar = this.add.graphics();
    const barBack = this.add.graphics();

    bar.x = unit.unit.x - 50;
    bar.y = unit.unit.y - 60;
    barBack.x = bar.x;
    barBack.y = bar.y;

    bar.fillStyle(color, 1);
    barBack.fillStyle(color, 0.5);

    bar.fillRect(0, 10, 100, 15);
    barBack.fillRect(0, 10, 100, 15);

    unit.text = this.add
      .text(bar.x + 50, bar.y + 18, unit.unit.hp, { fill: '#0f0' })
      .setOrigin(0.5, 0.5);

    return [bar, barBack];
  }

  setValue(unit) {
    unit.bar[0].scaleX = unit.unit.hp / unit.unit.maxHp;
  }

  updateBars() {
    Object.values(this.healthBar).forEach((oneBar) => {
      this.setValue(oneBar);
      oneBar.text.setText(oneBar.unit.hp);
    });
  }

  deleteBars() {
    Object.values(this.healthBar).forEach((oneBar) => {
      oneBar.bar[0].destroy();
      oneBar.bar[1].destroy();
      oneBar.text.destroy();
    });
  }
}

/* eslint-enable class-methods-use-this */
