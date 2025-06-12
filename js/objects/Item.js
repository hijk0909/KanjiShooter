// Item.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyDraw } from '../utils/DrawUtils.js';

const ORIGINAL_SIZE = 64;
const COUNTER_MAX = 20;

export class Item {
    constructor(scene){
        this.scene = scene;
        this.type = null;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.collision = new Phaser.Geom.Rectangle(-20, -20, 40, 40);  // 中心からの相対矩形
        this.sprite = null;
        this.sprite2 = null;
        this.size = 32;
        this.size2 = this.size;
        this.speed = 1;
        this.counter = 0;
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
            this.sprite2 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.sprite.texture.key);
            this.dy = 0.5;
        } else if (this.type === GLOBALS.ITEM.TYPE.HUSBAND){
            this.pos.x = GLOBALS.G_WIDTH / 2 - 200;
            this.sprite = this.scene.add.sprite(this.pos.x, pos.y, 'ih');
            this.sprite2 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.sprite.texture.key);
            this.dy = 0.5;
        } else if (this.type === GLOBALS.ITEM.TYPE.CHILD){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'ic');
            this.sprite2 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.sprite.texture.key);
            this.dy = 1;
        } else if (this.type === GLOBALS.ITEM.TYPE.FORCE){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'if');
            this.sprite2 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.sprite.texture.key);
            this.dy = 1;
        } else if (this.type === GLOBALS.ITEM.TYPE.POISON){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'ip');
            this.sprite2 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.sprite.texture.key);
            this.dy = 1;
        }
    }

    update() {
        this.pos.x += this.dx * this.speed * GameState.ff;
        this.pos.y += this.dy * this.speed * GameState.ff;

        // エフェクト用スプライトの調整
        if (this.state == GLOBALS.ITEM.STATE.OUT){
            this.sprite2.setAlpha(0);
        } else {
            this.counter =  Math.floor(this.counter + 1 * GameState.ff ) % COUNTER_MAX;
            this.sprite2.setAlpha((COUNTER_MAX - this.counter) / COUNTER_MAX);
            this.size2 = this.size * (this.counter / COUNTER_MAX + 1);
        }

        // スプライトの描画
        // console.log("Item Update()",this.pos, GameState.items.length);
        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);
        MyDraw.updateSprite(this.sprite2, this.pos, this.size2 / ORIGINAL_SIZE);

        // 画面外に出たら削除対象
        if (this.pos.y < -10 || this.pos.y > GLOBALS.G_HEIGHT + 10 ||
            this.pos.x < -100 || this.pos.x > GLOBALS.G_WIDTH + 100)
            this.alive = false;
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
        if ( this.sprite2 ){
            this.sprite2.destroy();
            this.sprite2 = null;
        }
    }

    isAlive() {
        return this.alive;
    }
}