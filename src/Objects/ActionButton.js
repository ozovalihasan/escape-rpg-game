import Phaser from 'phaser';

export default class ActionButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key1,key2, text, callback) {
    super(scene);
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.button = this.scene.add.sprite(0, 0, "blueButton1").setInteractive().setScrollFactor(0);;
    this.text = this.scene.add.text(0, 0, text, {
      fontSize: '16px',
      fill: '#fff',
    }).setScrollFactor(0);;
    Phaser.Display.Align.In.Center(this.text, this.button);

    this.add(this.button);
    this.add(this.text);

    this.button.on('pointerdown', () => {
      callback();
    });

    this.button.on('pointerover', () => {
      this.button.setTexture(key2);
    });

    this.button.on('pointerout', () => {
      this.button.setTexture(key1);
    });

    this.scene.add.existing(this);
  }
}
