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
        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        this.add.text(cx, cy - 50, 'KANJI Shooter', { fontSize: '64px', fill: '#ffee00' , stroke: COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 215, 'Copyright ©2025 Current Color Co. Ltd. All rights reserved.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 240, 'Version 1.3 2025.6.2.', { fontSize: '18px', fill: '#888' }).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 120, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);

        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.start_game());

        const btn_play = this.add.image(cx, cy + 60, 'btn_touch')
        .setOrigin(0.5,0.5)
        .setInteractive()
        .on('pointerdown', () => {this.start_game();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});

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
            // this.sound.play('se_tap');
            this.scene.start('GameScene');
        }

    update(time, delta){
        // 隠しキーボード操作
        if (Phaser.Input.Keyboard.JustDown(this.keyC)){
            this.scene.start('GameClearScene');
        }
    }
}