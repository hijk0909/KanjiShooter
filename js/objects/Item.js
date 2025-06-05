// Item.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyDraw } from '../utils/DrawUtils.js';

const ORIGINAL_SIZE = 64;

export class Item {
    constructor(scene){
        this.scene = scene;
        this.type = null;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.collision = new Phaser.Geom.Rectangle(-20, -20, 40, 40);  // 中心からの相対矩形
        this.size = 32;
        this.speed = 1;
        this.dx = 0;
        this.state = GLOBALS.ITEM.STATE.NORMAL;
        this.alive = true;
    }

    setType(type, pos){
        this.type = type;
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.alive = true;

        if (this.type === GLOBALS.ITEM.TYPE.WIFE){
            this.pos.x = GLOBALS.G_WIDTH / 2 + 200;
            this.sprite = this.scene.add.sprite(this.pos.x, pos.y, 'iw');
            this.dy = 0.5;
        } else if (this.type === GLOBALS.ITEM.TYPE.HUSBAND){
            this.pos.x = GLOBALS.G_WIDTH / 2 - 200;
            this.sprite = this.scene.add.sprite(this.pos.x, pos.y, 'ih');
            this.dy = 0.5;
        } else if (this.type === GLOBALS.ITEM.TYPE.CHILD){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'ic');
            this.dy = 1;
        } else if (this.type === GLOBALS.ITEM.TYPE.FORCE){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'if');
            this.dy = 1;
        } else if (this.type === GLOBALS.ITEM.TYPE.POISON){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'ip');
            this.dy = 1;
        }
    }

    update() {
        this.pos.x += this.dx * this.speed;
        this.pos.y += this.dy * this.speed;

        // console.log("Item Update()",this.pos, GameState.items.length);
        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);

        // 画面外に出たら削除対象
        if (this.pos.y < -10 || this.pos.y > GLOBALS.G_HEIGHT + 10 ||
            this.pos.x < -100 || this.pos.x > GLOBALS.G_WIDTH + 100)
            this.alive = false;
    }

    draw(graphics) {

    }

    exit(){
        this.state = GLOBALS.ITEM.STATE.OUT;
        this.sprite.setAlpha(0.5);
        this.dy = 0;
        this.dx = this.pos.x > GLOBALS.G_WIDTH / 2 ? 1 : -1 ;
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