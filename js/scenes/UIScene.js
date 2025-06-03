// UIScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';

const style1 = { font: '16px Arial', fill: '#ffffff' };
const style2 = { font: '24px Arial', fill: '#ffffff', shadow: {offsetX : 2, offsetY: 2, color : '#0ee', blur:0, fill: true, stroke: false }};
const style3 = { font: '48px Arial', fill: '#ffff00', stroke: '#ff0000', strokeThickness: 2};

export class UIScene extends Phaser.Scene {
    constructor(){
        super({ key: 'UIScene' });
    }

    create() {
        const cw = this.game.canvas.width;
        const ch = this.game.canvas.height;
        // console.log("scale,canvas height",this.scale.height, this.game.canvas.height);

        this.scoreText = this.add.text(10, 30, 'SCORE：0', style2);
    }

    update(time, delta){
        console.log("UI.update");
        this.score = GameState.score;
        this.scoreText.setText(`SCORE：${GameState.score}`);
    }
}