import Phaser from 'phaser';
import config from '../Config/config';

export default class TakeVehicle extends Phaser.GameObjects.Container {
  constructor(scene, callback, text = 'Cancel') {
    super(scene);
    this.scene = scene;
    this.x = config.width / 2;
    if (text === 'Cancel') {
      this.y = config.height / 2 + 50;
    } else {
      this.y = config.height / 2 - 50;
    }

    this.button = this.scene.add
      .sprite(0, 0, 'blueButton1')
      .setInteractive()
      .setScrollFactor(0);
    this.text = this.scene.add
      .text(0, 0, text, {
        fontSize: '32px',
        fill: '#fff',
      })
      .setScrollFactor(0);
    Phaser.Display.Align.In.Center(this.text, this.button);

    this.add(this.button);
    this.add(this.text);
    this.button.on('pointerdown', () => {
      callback();
      this.scene.destroyVehicleButtons();
    });

    this.button.on('pointerover', () => {
      this.button.setTexture('blueButton2');
    });

    this.button.on('pointerout', () => {
      this.button.setTexture('blueButton1');
    });

    this.scene.add.existing(this);
  }
}
