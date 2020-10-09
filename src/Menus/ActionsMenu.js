import Menu from './Menu';

export default class ActionsMenu extends Menu {
  constructor(x, y, scene) {
    super(x, y, scene);
    this.addMenuItem('Attack');
  }
  confirm() {
    // we select an action and go to the next menu and choose from the enemies to apply the action
    this.scene.events.emit('SelectedAction');
  }
}
