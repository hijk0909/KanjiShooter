// BG.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyDraw } from '../utils/DrawUtils.js';

export class BG {
    constructor(scene){
        this.scene = scene;
        this.graphics = this.scene.add.graphics(); 
        this.years = [];
        this.borders = [];
        this.last_pos = GLOBALS.POS.MAX;
        this.bg_color = GLOBALS.COLOR.BG;

        this.scrollEvents = [
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 10, spriteKey: 'y0'  },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 9,  spriteKey: 'y10' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 8,  spriteKey: 'y20' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 7,  spriteKey: 'y30' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 6,  spriteKey: 'y40' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 5,  spriteKey: 'y50' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 4,  spriteKey: 'y60' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 3,  spriteKey: 'y70' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 2,  spriteKey: 'y80' },
            { pos: GLOBALS.POS.GOAL + GLOBALS.POS.UNIT * 1,  spriteKey: 'y90' },
            { pos: GLOBALS.POS.GOAL, spriteKey: 'y100' }
        ];
    }

    update(pos) {
        this.graphics.clear();
        this.graphics.fillStyle(this.bg_color,1);
        this.graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height).setDepth(-999);

        // 生成(SPAWN)
        if (pos < this.last_pos){
            for (let i = 0; i < this.scrollEvents.length; i++) {
                const ev = this.scrollEvents[i];
                if (ev.pos >= pos && ev.pos < this.last_pos) {
                    const y = new Year(this.scene);
                    const sprite = this.scene.add.sprite(pos.x, pos.y, ev.spriteKey).setOrigin(0,1);
                    y.setType(sprite,new Phaser.Math.Vector2(0,0));
                    this.years.push(y);
                    const b = new Border(this.graphics);
                    this.borders.push(b);
                }
            }
            this.last_pos = pos;
        }

        // 更新
        for (let i = this.years.length - 1; i >= 0; i--) {
            const y = this.years[i];
            y.update();
            if (!y.isAlive()) {
                y.destroy();
                this.years.splice(i, 1);
            }
        }
        for (let i = this.borders.length - 1; i >= 0; i--) {
            const b = this.borders[i];
            b.update();
            if (!b.isAlive()) {
                b.destroy();
                this.borders.splice(i, 1);
            }
        }
    }

    set_color(color) {
        this.bg_color = color;
    }
}

class Year {
    constructor(scene){
        this.scene = scene;
        this.sprite = null;
        this.alive = true;
        this.pos = null;
    }
    setType(sprite,pos){
        this.sprite = sprite;
        this.pos = pos;
    }
    update(){
        this.pos.y += 1 * GameState.ff;
        MyDraw.updateSprite(this.sprite, this.pos, 1);
        if (this.pos.y > GLOBALS.G_HEIGHT){
            this.alive = false;
        }
    }
    isAlive(){
        return this.alive;
    }
    destroy(){
        if ( this.sprite ){
            this.sprite.destroy();
            this.sprite = null;
        }        
    }
}

class Border {
    constructor(graphics){
        this.graphics = graphics;
        this.alive = true;
        this.pos = 0;
    }

    update(){
        this.pos += 1 * GameState.ff;
        this.graphics.lineStyle(2, 0xff0000, 0.5);
        MyDraw.drawLine(this.graphics, 0,this.pos, GLOBALS.G_WIDTH, this.pos);
        if (this.pos > GLOBALS.G_HEIGHT){
            this.alive = false;
        }
    }
    isAlive(){
        return this.alive;
    }
    destroy(){
    }
}