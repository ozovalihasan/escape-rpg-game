import Phaser from 'phaser';


export default {
  type: Phaser.AUTO,
  parent: 'content',
  width: document.documentElement.scrollWidth * window.devicePixelRatio,
  height: document.documentElement.scrollHeight * window.devicePixelRatio,
  zoom: 1,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};
