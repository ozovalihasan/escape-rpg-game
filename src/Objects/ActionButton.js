import Button from './Button';

export default class ActionButton extends Button {
  constructor(scene, x, y, key1, key2, text, callback) {
    super(scene, x, y, key1, key2, text);
    this.button.on('pointerdown',       callback    );
  }
}
  