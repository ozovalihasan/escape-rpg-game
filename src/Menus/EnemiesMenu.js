import Menu from './Menu';

export default class EnemiesMenu extends Menu {
  confirm() {
    this.scene.events.emit('Enemy', this.menuItemIndex);
  }
}
