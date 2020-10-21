import Phaser from 'phaser';
import SceneButton from '../Objects/SceneButton';
import config from '../Config/config';


export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  create() {
    this.model = this.sys.game.globals.model;
    this.text = this.add.text(config.width / 2, config.height / 6, 'Options', {
      fontSize: 40,
    }).setOrigin(0.5, 0.5);
    this.musicButton = this.add.image(config.width / 4, config.height * (2 / 5), 'checkedBox');
    this.musicText = this.add.text(config.width / 4 + 50, config.height * (2 / 5) - 10, 'Music Enabled', {
      fontSize: 24,
    });

    this.soundButton = this.add.image(config.width / 4, config.height * (3 / 5), 'checkedBox');
    this.soundText = this.add.text(config.width / 4 + 50, config.height * (3 / 5) - 10, 'Sound Enabled', {
      fontSize: 24,
    });

    this.musicButton.setInteractive();
    this.soundButton.setInteractive();

    this.musicButton.on('pointerdown', () => {
      this.model.musicOn = !this.model.musicOn;
      this.updateAudio();
    });

    this.soundButton.on('pointerdown', () => {
      this.model.soundOn = !this.model.soundOn;
      this.updateAudio();
    });

    this.menuButton = new SceneButton(
      this,
      config.width / 2,
      config.height * (4 / 5),
      'blueButton1',
      'blueButton2',
      'Menu',
      'Title',
    );
    this.updateAudio();
  }

  updateAudio() {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture('box');
      if (this.model.bgMusicPlaying === true) {
        this.sys.game.globals.bgMusic.stop();
        this.model.bgMusicPlaying = false;
      }
    } else {
      this.musicButton.setTexture('checkedBox');
      this.sys.game.globals.bgMusic.play();
      this.model.bgMusicPlaying = true;
    }
    if (this.model.soundOn === false) {
      this.soundButton.setTexture('box');
    } else {
      this.soundButton.setTexture('checkedBox');
    }
  }
}
