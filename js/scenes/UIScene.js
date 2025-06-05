// UIScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';

const style1 = { font: '16px Arial', fill: '#ffffff' };
const style2 = { font: '24px Arial', fill: '#ffffff', shadow: {offsetX : 2, offsetY: 2, color : '#eee', blur:0, fill: true, stroke: false }};
const style3 = { font: '48px Arial', fill: '#ffff00', stroke: '#ff0000', strokeThickness: 2};

export class UIScene extends Phaser.Scene {
    constructor(){
        super({ key: 'UIScene' });
    }

    create() {
        this.cw = this.game.canvas.width;
        this.ch = this.game.canvas.height;
        // console.log("scale,canvas height",this.scale.height, this.game.canvas.height);

        this.scoreText = this.add.text(10, 30, 'SCORE：0', style2);
        this.remainText = this.add.text(10, 60, 'REMAIN：0', style2);
        this.energyText = this.add.text(this.cw - 180, 30, 'ENERGY:', style2);
        this.uiGraphics = this.add.graphics(); 
    }

    update(time, delta){
        this.score = GameState.score;
        this.scoreText.setText(`SCORE：${GameState.score}`);
        this.remainText.setText(`REMAIN：${GameState.pos}`);
        this.energyText.setText(`ENERGY：${Math.floor(GameState.player.energy)}`);

        this.uiGraphics.clear();
        const posEnergy = this.ch *( 1 - GameState.player.energy / 100);
        this.uiGraphics.fillStyle(0xffe000, 0.5);
        this.uiGraphics.fillRect(this.cw-15, posEnergy, this.cw, this.ch);
    }
}