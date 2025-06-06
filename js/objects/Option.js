// Option.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyDraw } from '../utils/DrawUtils.js';

const ORIGINAL_SIZE = 64;
const FLOAT_SPEED = 3;

export class Option {
    constructor(scene){
        this.scene = scene;
        this.type = null;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.sprite = null;
        this.collision = new Phaser.Geom.Rectangle(-20, -20, 40, 40);
        this.state = GLOBALS.OPTION.STATE.FLOAT;
        this.alive = true;
        this.op_num = 0;
        this.trace_time_diff = 0;
        this.lifespan = 0;
    }

    setType(type, pos, op_num){
        this.type = type;
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.state = GLOBALS.OPTION.STATE.FLOAT;
        this.alive = true;

        if ( this.type === GLOBALS.ITEM.TYPE.WIFE){
            this.size = 36;
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'ow');
            this.op_num = 2;
            this.trace_time_diff = 10;
            this.lifespan = 2700 + Math.floor(Math.random() * 500);
        } else if ( this.type === GLOBALS.ITEM.TYPE.HUSBAND){
            this.size = 36;
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'oh');
            this.op_num = 2;
            this.trace_time_diff = 10;
            this.lifespan = 2500 + Math.floor(Math.random() * 500);
        } else if ( this.type === GLOBALS.ITEM.TYPE.CHILD){
            this.size = 32;
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'oc');
            this.op_num = op_num;
            this.trace_time_diff = 10 + 8 * (op_num - 2);
            this.lifespan = 2800 + Math.floor(Math.random() * 200);
        }

        this.sprite.visible = false;
    }

    update( pos ) {
        if (this.state === GLOBALS.OPTION.STATE.FLOAT){
            const dx = pos.x - this.pos.x;
            const dy = pos.y - this.pos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 2){
                this.state = GLOBALS.OPTION.STATE.NORMAL;
            } else if (dist > 0){
                this.pos.x += (dx / dist) * FLOAT_SPEED * GameState.ff;
                this.pos.y += (dy / dist) * FLOAT_SPEED * GameState.ff;
            }
        } else if (this.state === GLOBALS.OPTION.STATE.NORMAL){
            this.pos = pos;
            this.lifespan -= 1 * GameState.ff;
            if (this.lifespan < 0){
                this.state = GLOBALS.OPTION.STATE.OUT;
                if (this.pos.x > GLOBALS.G_WIDTH / 2){
                    this.dx = 1;
                } else {
                    this.dx = -1;
                }
                this.sprite.setAlpha(0.5);
            }
        } else if (this.state === GLOBALS.OPTION.STATE.OUT){
            this.pos.x += this.dx * GameState.ff;
            if (this.pos.x < -this.size || this.pos.x > GLOBALS.G_WIDTH){
                this.alive = false;
            }
        }
        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);        
    }

    draw(graphics) {

    }

    destroy(){
        if ( this.sprite ){
            this.sprite.destroy();
            this.sprite = null;
        }        
    }

    isAlive() {
        return this.alive;
    }
}