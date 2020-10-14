import config from '../Config/config';
import Phaser from 'phaser';
import OperationsAPI from '../Message/OperationsAPI';
import Button from '../Objects/Button';

export default class ScoreScene extends Phaser.Scene {
  constructor() {
    super('Score');
  }
  create() {
    OperationsAPI.getScores()
      .then((games) => {
        this.addNames(games.result);
      })
      .catch((error) => {
        alert(error);
      });
  }

  addNames(games) {
    this.add
      .text(config.width / 2, 40, 'High Scores', {
        fontsize: '32px',
        fill: '#fff',
      })
      .setOrigin(0.5, 0.5);

    const orderedgames = games
      .sort((game1, game2) => game2.score - game1.score)
      .slice(0, 5);

    orderedgames.forEach((game, index) => {
      this.add
        .text(config.width / 2 - 35, index * 30 + 100, game.user, {
          fontsize: '32px',
          fill: '#fff',
        })
        .setOrigin(0.5, 0.5);

      this.add
        .text(config.width / 2 + 45, index * 30 + 100, game.score, {
          fontsize: '32px',
          fill: '#fff',
        })
        .setOrigin(0.5, 0.5);
    });

    this.menuButton = new Button(
      this,
      config.width / 2,
      config.height - 50,
      'blueButton1',
      'blueButton2',
      'Menu',
      'Title'
    );
  }
}
