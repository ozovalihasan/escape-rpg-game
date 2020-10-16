
import Button from './Button';
import config from '../Config/config';

export default class TakeVehicle extends Button {
  constructor(scene, callback, text = 'Cancel') {
    super(scene, config.width / 2, config.height / 2 - 50, 'blueButton1', 'blueButton2', text);

    if (text === 'Cancel') {
      this.y = config.height / 2 + 50;
    }

    this.text.setFontSize(32);

    this.button.on('pointerdown', () => {
      callback();
      this.scene.destroyVehicleButtons();
    });
  }
}
