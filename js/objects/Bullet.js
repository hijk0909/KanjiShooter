// Bullet.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyDraw } from '../utils/DrawUtils.js';

const ORIGINAL_SIZE = 64;

export class Bullet {
    constructor(scene){
        this.scene = scene;
        this.type = null;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.size = 36;
        this.collision = new Phaser.Geom.Rectangle(-20, -20, 40, 40);  // 中心からの相対矩形
        this.alive = true;
        this.op = 0;
        this.sprite = null;
    }

    setType(type, pos){
        this.type = type;
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.alive = true;
        if ( this.type === GLOBALS.BULLET.TYPE.PLAYER_L){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bpl');
        } else if ( this.type === GLOBALS.BULLET.TYPE.PLAYER_A){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bpa');
        }
    }

    set_op(op){
        this.op = op;
    }

    update() {

        this.pos.y -= 10;
        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);

        // 画面外に出たら削除対象
        if (this.pos.y < -10 || this.pos.y > GLOBALS.G_HEIGHT + 10 ||
            this.pos.x < -100 || this.pos.x > GLOBALS.G_WIDTH + 100)
            this.alive = false;
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