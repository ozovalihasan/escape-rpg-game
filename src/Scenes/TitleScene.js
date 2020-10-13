import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';
import ActionButton from '../Objects/ActionButton';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.sys.game.globals.username = 'Guest';
    this.username = this.add.text(
      config.width/2,
      50,
      `Welcome ${this.sys.game.globals.username}!`,
      { fill: '#0f0' }
    ).setOrigin(0.5, 0.5);

    this.changeName = new ActionButton(
      this,
      config.width / 2,
      config.height / 2 - 90,
      'blueButton1',
      'blueButton2',
      'Change Name',
      () => {
        const result = prompt('Please enter your name');
        if (result) {
          this.username.setText(`Welcome ${result}!`);
        }
      }
    );
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 - 20,
      'blueButton1',
      'blueButton2',
      'Play',
      'World'
    );
    this.optionsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 40,
      'blueButton1',
      'blueButton2',
      'Options',
      'Options'
    );

    this.scoreButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 100,
      'blueButton1',
      'blueButton2',
      'Score Board',
      'Score'
    );
    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 160,
      'blueButton1',
      'blueButton2',
      'Credits',
      'Credits'
    );

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }
}
