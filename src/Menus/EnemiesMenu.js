import Menu from './Menu';

export default class EnemiesMenu extends Menu {
  constructor(x, y, scene) {
    super(x, y, scene);
  }
  confirm() {
    // the player has selected the enemy and we send its id with the event
    this.scene.events.emit('Enemy', this.menuItemIndex);
  }
}
