
import Button from './Button';

export default class TakeVehicle extends Button {
  constructor(scene, x, y, key1, key2, text, targetScene) {
    super(scene, x, y, key1, key2, text);

    this.button.on('pointerdown', () => {
      this.scene.scene.start(targetScene);
    });
  }
}
