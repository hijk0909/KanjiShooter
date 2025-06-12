// TitleScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';

const { COLOR } = GLOBALS;

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // this.sound.pauseOnBlur = false; //play時の警告を出さない

        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        this.add.text(cx, 50, 'KANJI Shooter', { fontSize: '64px', fill: '#ffee00' , stroke: COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 215, 'Copyright ©2025 Current Color Co. Ltd. All rights reserved.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 240, 'Version 1.4 2025.6.12.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 120, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);

        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.start_game());

        const btn_play = this.add.image(cx, cy + 60, 'btn_tap')
        .setOrigin(0.5,0.5)
        .setInteractive()
        .on('pointerdown', () => {this.start_game();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});

        const opy=100;
        this.add.image(150,opy,'op_key').setOrigin(0.5,0);
        this.add.image(400,opy,'op_gamepad').setOrigin(0.5,0);
        // this.add.image(650,opy,'op_touch').setOrigin(0.5,0);
        this.sprite = this.add.sprite(650, opy, 'op_touch_anim').setOrigin(0.5,0);
        if (!this.anims.exists('op_touch_anims')) {
            this.anims.create({key:'op_touch_anims',
                repeat : -1,
                duration : 1,
                defaultTextureKey: 'op_touch_anim',
                frames: [
                    { frame: 0, duration : 1500 },
                    { frame: 1, duration : 120 },
                    { frame: 2, duration : 1500 },
                    { frame: 3, duration : 120 }
                ]                
            });
        }
        this.sprite.play('op_touch_anims');

        GameState.reset();
    }

    show_pad(){
        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        this.add.text(cx, cy + 140, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    start_game(){

            // 念のため、他のシーンを止める
            this.scene.stop('MainScene');
            this.scene.stop('GameOverScene');
            this.scene.stop('GameClearScene');
            this.scene.stop('UI');

            // console.log(this.scene.manager.getScenes(true).map(s => s.scene.key));
            GameState.sound.se_tap.play();
            this.scene.start('GameScene');
        }

    update(time, delta){
        // 隠しキーボード操作
        if (Phaser.Input.Keyboard.JustDown(this.keyC)){
            this.scene.start('GameClearScene');
        }
    }
}