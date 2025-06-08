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
        const cx = GLOBALS.G_WINDOW_WIDTH / 2;
        const cy = GLOBALS.G_WINDOW_HEIGHT / 2;
        this.add.text(cx, cy - 50, 'GAME CLEAR', { fontSize: '64px', fill: '#ffffff' , stroke: COLOR.WHITE, strokeThickness: 2}).setOrigin(0.5,0.5);
        this.add.text(cx, cy + 120, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);
        this.add.text(cx, cy , `Your final score is:${GameState.score}`,{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);

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

        GameState.sound.bgm_clear.play();

        // パーティクル
        let graphics = this.make.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 8, 8);
        graphics.generateTexture('confetti', 8, 8);

        this.confettiEmitter = this.add.particles(0, 0, 'confetti', {
            x: { min: 0, max: GLOBALS.G_WINDOW_WIDTH },
            y: 0,
            lifespan: 4000,
            speedY: { min: 40, max: 80 },
            speedX: { min: -50, max: 50 },
            angle: { min: 240, max: 300 },
            gravityY: 30,
            scale: { start: 0.6, end: 0.6 },
            rotate: { min: 0, max: 360 },
            alpha: { start: 1, end: 0 },
            quantity: 4,
            frequency: 100,
            blendMode: 'NORMAL',
            tint: [0xffffff, 0xcccccc, 0xaaaaaa, 0x999999, 0x777777]
        });

    }

    show_pad(){
        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        this.add.text(cx, cy + 140, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    goto_title(){
        GameState.sound.bgm_clear.stop();
        GameState.sound.se_tap.play();
        this.scene.start('TitleScene');
    }

    update(time, delta){
    }
}