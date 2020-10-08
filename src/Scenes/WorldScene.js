import Phaser from 'phaser';

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('World');
  }
  init() {}
  preload() {}
  create() {
    var map = this.make.tilemap({ key: 'map' });
    var tiles = map.addTilesetImage('spritesheet', 'tiles');

    var grass = map.createStaticLayer('Grass', tiles, 0, 0);
    var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    obstacles.setCollisionByExclusion([-1]);
  }
}
