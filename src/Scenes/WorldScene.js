import Phaser from 'phaser';
import TakeVehicle from '../Objects/TakeVehicle';
import config from '../Config/config';
import Button from '../Objects/Button';
import ActionButton from '../Objects/ActionButton';
import OperationsAPI from '../Message/OperationsAPI';

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('World');
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });


    const tiles = map.addTilesetImage('spritesheet', 'tiles');


    const grass = map.createStaticLayer('Grass', tiles, 0, 0);
    const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    const water = map.createStaticLayer('Water', tiles, 0, 0);
    const shore = map.createStaticLayer('Shore', tiles, 0, 0);


    grass.setCollisionByExclusion([-1]);
    obstacles.setCollisionByExclusion([-1]);
    water.setCollisionByExclusion([-1]);
    shore.setCollisionByExclusion([-1]);

    this.player = this.physics.add.sprite(50, 100, 'player', 6);
    this.player.damage = 10;
    this.player.actionWay = 'walk';
    this.player.score = 0;

    this.scoreText = this.add
      .text(10, 10, this.player.score, {
        fontsize: '32px',
        fill: '#fff',
      })
      .setScrollFactor(0);

    this.submarine = this.physics.add.sprite(410, 250, 'submarine', 1);
    this.submarine.setScale(0.5);

    this.boat = this.physics.add.sprite(60, 160, 'boat', 0);
    this.boat.setScale(0.8);
    this.player.collider = {};
    this.player.collider = {
      obstacles: this.physics.add.collider(this.player, obstacles),
      water: this.physics.add.collider(this.player, water),
      grass: this.physics.add.collider(this.player, grass),
      shore: this.physics.add.collider(this.player, shore),
    };

    this.player.collider.grass.active = false;
    this.player.collider.shore.active = false;
    this.riverShore = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });
    this.grassShore = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });

    this.getBoat({ x: 56, y: 160, width: 48, height: 1, delta: 4 });
    this.getOffBoat({ x: 56, y: 144, width: 48, height: 1, delta: -4 });

    this.getBoat({ x: 208, y: 16, width: 1, height: 32, delta: -4 });
    this.getOffBoat({ x: 224, y: 16, width: 1, height: 32, delta: 4 });

    this.anims.create({
      key: 'marine',
      frames: this.anims.generateFrameNumbers('marine', {
        frames: [1, 2, 3, 4],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.marine.anims.play('marine', true);
    this.anims.create({
      key: 'boat',
      frames: this.anims.generateFrameNumbers('boat', {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: 'boatRight',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 7, 7],
      }),
      frameRate: 3,
      repeat: -1,
    });

    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // animation with key 'right'
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [2, 8, 2, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0, 6, 0, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cursors.esc = this.input.keyboard.addKey('ESC');

    this.bigBoss = this.physics.add.staticGroup({
      classType: Phaser.Physics.Arcade.sprite,
    });

    this.bigBoss.create(100, 20, 'dragonorange');
    this.bigBoss.create(300, 300, 'dragonorange');
    this.bigBoss.create(0, 290, 'dragonorange');
    this.bigBoss.create(350, 20, 'dragonblue');

    this.physics.add.overlap(
      this.player,
      this.bigBoss,
      (body1, body2) => {
        this.player.enemy = {
          name: 'Dragon',
          texture: 'dragonorange',
          damage: [40, 70],
          addScore: [20, 30],
          addDamage: [5, 8],
          hp: [70, 90],
        };
        this.onMeetEnemy(body1, body2);
      },
      false,
      this
    );

    this.hiddenEnemies = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });

    for (let i = 0; i < 15; i += 1) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

      this.hiddenEnemies.create(x, y, 10, 10);
    }

    this.physics.add.overlap(
      this.player,
      this.hiddenEnemies,
      (body1, body2) => {
        this.player.enemy = {
          name: 'Dragon',
          texture: 'dragonblue',
          damage: [20, 60],
          addScore: [10, 20],
          addDamage: [2, 5],
          hp: [60, 70],
        };
        this.onMeetEnemy(body1, body2);
      },
      false,
      this
    );

    this.titleButton = new ActionButton(
      this,
      config.width / 2,
      config.height / 2 - 100,
      'blueButton1',
      'blueButton2',
      'Menu',
      async () => {
        OperationsAPI.update(
          this.sys.game.globals.username,
          this.player.score
        ).then(() => {
          this.scene.start('Score');
        });
      }
    );
    this.titleButton.visible = false;

    // we listen for 'wake' event
    this.sys.events.on('wake', this.wake, this);
  }

  visibleToggle(element) {
    if (element.visible === true) {
      element.visible = false;
    } else {
      element.visible = true;
    }
  }
  wake() {
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }
  updateScore(delta) {
    this.player.score += delta;
    this.scoreText.setText(this.player.score);
  }

  onMeetEnemy(player, zone) {
    // we move the zone to some other location
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    // shake the world
    this.cameras.main.shake(300);

    this.input.stopPropagation();
    // start battle
    this.scene.switch('Battle');
  }

  getBoat(zoneShape) {
    this.riverShore.create(
      zoneShape.x,
      zoneShape.y,
      zoneShape.width,
      zoneShape.height
    ).delta = zoneShape.delta;

    this.player.collider.riverShore = this.physics.add.overlap(
      this.player,
      this.riverShore,
      function (body1, body2) {
        if (this.player.actionWay === 'walk') {
          this.player.collider.grass.active = true;
          this.player.actionWay = 'walkBoat';
          this.vehicleButton = new TakeVehicle(
            this,
            config.width / 2,
            config.width / 2 - 50,
            'Get boat',
            () => {
              this.player.collider.grassShore.active = true;
              this.player.collider.river.active = false;
              // this.player.setY(this.player.y + 2);
              if (body2.height < body2.width) {
                this.player.setY(this.player.y + body2.delta);
              } else {
                this.player.setX(this.player.x + body2.delta);
              }
              this.player.actionWay = 'boat';
              this.vehicleButton.destroy();
              this.cancelButton.destroy();
            }
          );
          this.cancelButton = new TakeVehicle(
            this,
            config.width / 2,
            config.width / 2 + 50,
            'Cancel',
            () => {
              this.player.collider.riverShore.active = true;
              this.player.collider.grass.active = false;
              // this.player.setY(this.player.y - 2);
              if (body2.height < body2.width) {
                this.player.setY(this.player.y - body2.delta);
              } else {
                this.player.setX(this.player.x - body2.delta);
              }
              this.player.actionWay = 'walk';
              this.vehicleButton.destroy();
              this.cancelButton.destroy();
            }
          );
        } else {
          this.player.collider.riverShore.active = false;
        }
      },
      false,
      this
    );
  }

  getOffBoat(zoneShape) {
    this.grassShore.create(
      zoneShape.x,
      zoneShape.y,
      zoneShape.width,
      zoneShape.height
    ).delta = zoneShape.delta;

    this.player.collider.grassShore = this.physics.add.overlap(
      this.player,
      this.grassShore,
      function (body1, body2) {
        if (this.player.actionWay === 'boat') {
          this.player.collider.river.active = true;
          this.player.actionWay = 'boatWalk';
          this.vehicleButton = new TakeVehicle(
            this,
            config.width / 2,
            config.width / 2 - 50,
            'Get off boat',
            () => {
              this.player.collider.riverShore.active = true;
              this.player.collider.grass.active = false;
              if (body2.height < body2.width) {
                this.player.setY(this.player.y + body2.delta);
              } else {
                this.player.setX(this.player.x + body2.delta);
              }
              this.player.actionWay = 'walk';
              this.vehicleButton.destroy();
              this.cancelButton.destroy();
            }
          );
          this.cancelButton = new TakeVehicle(
            this,
            config.width / 2,
            config.width / 2 + 50,
            'Cancel',
            () => {
              this.player.collider.grassShore.active = true;
              this.player.collider.river.active = false;
              this.player.setY(this.player.y + 2);
              if (body2.height < body2.width) {
                this.player.setY(this.player.y - body2.delta);
              } else {
                this.player.setX(this.player.x - body2.delta);
              }
              this.player.actionWay = 'boat';
              this.vehicleButton.destroy();
              this.cancelButton.destroy();
            }
          );
        } else {
          this.player.collider.grassShore.active = false;
        }
      },
      false,
      this
    );

    this.player.collider.grassShore.active = false;
  }

  update(time, delta) {
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }
    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    if (this.cursors.esc.isDown) {
      this.visibleToggle(this.titleButton);
      this.cursors.esc.isDown = false;
    }
    // Update the animation last and give left/right animations precedence over up/down animations

    if (
      this.player.actionWay === 'boat' ||
      this.player.actionWay === 'boatWalk'
    ) {
      this.boat.x = this.player.x - 1;
      this.boat.y = this.player.y + 10;
      this.player.anims.play('boatRight', true);
      this.boat.anims.play('boat', true);

      if (this.cursors.left.isDown) {
        this.player.flipX = false;
        this.boat.flipX = true;
      } else {
        this.player.flipX = true;
        this.boat.flipX = false;
      }
    } else {
      this.boat.anims.stop();

      if (this.cursors.left.isDown) {
        this.player.anims.play('left', true);
        this.player.flipX = true;
      } else if (this.cursors.right.isDown) {
        this.player.anims.play('right', true);
        this.player.flipX = false;
      } else if (this.cursors.up.isDown) {
        this.player.anims.play('up', true);
      } else if (this.cursors.down.isDown) {
        this.player.anims.play('down', true);
      } else {
        this.player.anims.stop();
      }
    }
  }
}
