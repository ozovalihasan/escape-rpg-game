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
    // draw some background for the menu
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(
      2,
      (config.height * 2) / 4,
      config.width / 4,
      config.height / 4
    );
    this.graphics.fillRect(
      2,
      (config.height * 2) / 4,
      config.width / 4,
      config.height / 4
    );
    this.graphics.strokeRect(
      config.width / 4,
      (config.height * 2) / 4,
      config.width / 4,
      config.height / 4
    );
    this.graphics.fillRect(
      config.width / 4,
      (config.height * 2) / 4,
      config.width / 4,
      config.height / 4
    );
    this.graphics.strokeRect(
      config.width / 2,
      (config.height * 2) / 4,
      config.width / 2,
      config.height / 4
    );
    this.graphics.fillRect(
      config.width / 2,
      (config.height * 2) / 4,
      config.width / 2,
      config.height / 4
    );

    // basic container to hold all menus
    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemiesMenu = new EnemiesMenu(8, 153, this);

    // the currently selected menu
    this.currentMenu = this.actionsMenu;

    // add menus to the container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battle = this.scene.get('Battle');

    // listen for keyboard events
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    // when its player cunit turn to move
    this.battle.events.on('PlayerSelect', this.onPlayerSelect, this);

    // when the action on the menu is selected
    // for now we have only one action so we dont send and action id
    this.events.on('SelectedAction', this.onSelectedAction, this);

    // an enemy is selected
    this.events.on('Enemy', this.onEnemy, this);

    // when the scene receives wake event
    this.sys.events.on('wake', this.afterWake, this);

    // the message describing the current action
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
    this.healthBar.warrior.bar = this.makeBar(190, 0, 0x2ecc71);
    this.healthBar.warrior.text = this.add.text(
      290,
      7,
      this.battle.heroes[0].hp,
      { fill: '#0f0' }
    );
    this.healthBar.bluedragon.bar = this.makeBar(30, 0, 0x2ecc71);
    this.healthBar.bluedragon.text = this.add.text(
      0,
      7,
      this.battle.enemies[0].hp,
      { fill: '#0f0' }
    );
    this.updateBars();
    console.log(this.healthBar);

    this.battle.events.on('UpdateHealthBars', this.updateBars, this);
    this.battle.events.on('DeleteHealthBars', this.deleteBars, this);
  }

  makeBar(x, y, color) {
    //draw the bar
    const bar = this.add.graphics();
    const barBack = this.add.graphics();
    //color the bar
    bar.fillStyle(color, 1);
    barBack.fillStyle(color, 0.5);

    //fill the bar with a rectangle
    bar.fillRect(0, 10, 100, 15);
    barBack.fillRect(0, 10, 100, 15);

    //position the bar
    bar.x = x;
    bar.y = y;
    barBack.x = x;
    barBack.y = y;

    //return the bar
    return [bar, barBack];
  }
  setValue(unit) {
    //scale the bar
    unit.bar[0].scaleX = unit.unit.hp / unit.unit.maxHp;
  }

  updateBars() {
    for (const oneBar in this.healthBar) {
      this.setValue(this.healthBar[oneBar]);
    }
  }

  deleteBars() {
    for (const oneBar in this.healthBar) {
      this.healthBar[oneBar].bar[0].destroy();
      this.healthBar[oneBar].bar[1].destroy();
    }
  }

  createMenu() {
    // map hero menu items to heroes
    this.remapHeroes();
    // map enemies menu items to enemies
    this.remapEnemies();
    // first move
    this.battle.nextTurn();
  }
  onEnemy(index) {
    // when the enemy is selected, we deselect all menus and send event with the enemy id
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battle.receivePlayerSelection('attack', index);
  }
  onPlayerSelect(id) {
    // when its player turn, we select the active hero item and the first action
    // then we make actions menu active
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }
  // we have action selected and we make the enemies menu active
  // the player needs to choose an enemy to attack
  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }
  remapHeroes() {
    var heroes = this.battle.heroes;
    this.heroesMenu.remap(heroes);
  }
  remapEnemies() {
    var enemies = this.battle.enemies;
    this.enemiesMenu.remap(enemies);
  }
  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  }
}
