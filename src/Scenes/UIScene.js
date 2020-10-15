/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import HeroesMenu from '../Menus/HeroesMenu';
import EnemiesMenu from '../Menus/EnemiesMenu';
import ActionsMenu from '../Menus/ActionsMenu';
import Message from '../Message/Message';
import config from '../Config/config';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(
      2,
      config.height * (2 / 4),
      config.width / 4,
      config.height / 4,
    );
    this.graphics.fillRect(
      2,
      config.height * (2 / 4),
      config.width / 4,
      config.height / 4,
    );
    this.graphics.strokeRect(
      config.width / 4,
      config.height * (2 / 4),
      config.width / 4,
      config.height / 4,
    );
    this.graphics.fillRect(
      config.width / 4,
      config.height * (2 / 4),
      config.width / 4,
      config.height / 4,
    );
    this.graphics.strokeRect(
      config.width / 2,
      config.height * (2 / 4),
      config.width / 2,
      config.height / 4,
    );
    this.graphics.fillRect(
      config.width / 2,
      config.height * (2 / 4),
      config.width / 2,
      config.height / 4,
    );


    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(config.width * (6 / 8), config.height * (2 / 4) + 30, this);
    this.actionsMenu = new ActionsMenu(config.width * (3 / 8), config.height * (2 / 4) + 30, this);
    this.enemiesMenu = new EnemiesMenu(config.width / 8, config.height * (2 / 4) + 30, this);


    this.currentMenu = this.actionsMenu;


    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battle = this.scene.get('Battle');


    this.input.keyboard.on('keydown', this.onKeyInput, this);


    this.battle.events.on('PlayerSelect', this.onPlayerSelect, this);


    this.events.on('SelectedAction', this.onSelectedAction, this);


    this.events.on('Enemy', this.onEnemy, this);


    this.sys.events.on('wake', this.afterWake, this);


    this.message = new Message(this, this.battle.events);
    this.add.existing(this.message);

    this.createMenu();
    this.addHealthBars();
  }

  afterWake() {
    this.createMenu();
    this.addHealthBars();
  }

  addHealthBars() {
    this.healthBar = {
      warrior: { unit: this.battle.heroes[0] },
      bluedragon: { unit: this.battle.enemies[0] },
    };
    this.healthBar.warrior.bar = this.makeBar(this.healthBar.warrior, 0x2ecc71);

    this.healthBar.bluedragon.bar = this.makeBar(this.healthBar.bluedragon, 0x2ecc71);

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

    unit.text = this.add.text(
      bar.x + 50,
      bar.y + 18,
      unit.unit.hp,
      { fill: '#0f0' },
    ).setOrigin(0.5, 0.5);


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

  createMenu() {
    this.remapHeroes();

    this.remapEnemies();

    this.battle.nextTurn();
  }

  onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battle.receivePlayerSelection('attack', index);
  }

  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }


  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }

  remapHeroes() {
    const { heroes } = this.battle;
    this.heroesMenu.remap(heroes);
  }

  remapEnemies() {
    const { enemies } = this.battle;
    this.enemiesMenu.remap(enemies);
  }

  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  }
}

/* eslint-enable class-methods-use-this */
