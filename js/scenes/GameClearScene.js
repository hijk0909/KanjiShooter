// GameClearScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';

const { COLOR } = GLOBALS;

export class GameClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameClearScene' });
    }

    create() {
        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        this.add.text(cx, cy - 50, 'GAME CLEAR', { fontSize: '64px', fill: '#00ffff' , stroke: COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 120, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);

        this.finalScoreText = this.add.text(cx, cy , 'Your final score is:',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);
        this.finalScoreText.setText(`Your final score is:${GameState.score}`);

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.goto_title());

        const btn_play = this.add.image(cx, cy + 60, 'btn_tap')
        .setOrigin(0.5,0.5)
        .setInteractive()
        .on('pointerdown', () => {this.goto_title();})
        .on('pointerover', () => {btn_play.setTint(0xcccccc);})
        .on('pointerout', () => {btn_play.clearTint();});
    }

    show_pad(){
        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        this.add.text(cx, cy + 140, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    goto_title(){
        this.scene.start('TitleScene');
    }

    update(time, delta){
    }
}