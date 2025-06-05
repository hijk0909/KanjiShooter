// NPC.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyDraw } from '../utils/DrawUtils.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from '../objects/Bullet.js';

const ORIGINAL_SIZE = 64;

export class NPC {
    constructor(scene){
        this.scene = scene;
        this.type = null;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.sprite = null;
        this.collision = new Phaser.Geom.Rectangle(-20, -20, 40, 40); 
        this.size = 40;
        this.hp = 100;
        this.alive = true;
    }

    setType(type, pos){
        this.type = type;
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.alive = true;
        this.dx = 0;
        this.dy = 1;
        if ( this.type == GLOBALS.NPC.TYPE.ENEMY){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'ce');
            this.x_center = this.pos.x;
            this.dy = Math.random()*2 + 2;
            this.cnt = 0;
        } else if ( this.type == GLOBALS.NPC.TYPE.FRIEND){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cf');
            this.dy = Math.random()*2 + 2;
        } else if ( this.type == GLOBALS.NPC.TYPE.FATHER){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cfa');
            this.state = GLOBALS.NPC.STATE.IN;
            this.dy = 3;
            this.lifespan = 700;
        } else if ( this.type == GLOBALS.NPC.TYPE.MOTHER){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cma');
            this.state = GLOBALS.NPC.STATE.IN;
            this.dy = 3;
            this.lifespan = 900;
        } else if ( this.type == GLOBALS.NPC.TYPE.OLD){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cold');
        } else if ( this.type == GLOBALS.NPC.TYPE.BOSS){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cboss');
        } else if ( this.type == GLOBALS.NPC.TYPE.DISASTER){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cdisaster');
        }

        this.sprite.visible = false;
    }

    update() {
        if ( this.type == GLOBALS.NPC.TYPE.ENEMY){
            this.cnt = (this.cnt + 10 > 360) ? this.cnt + 10 - 360 : this.cnt + 10;
            this.pos.x = this.x_center +  10 * Math.cos(MyMath.radians(this.cnt));
            this.pos.y += this.dy;
        } else if ( this.type == GLOBALS.NPC.TYPE.FRIEND){
            this.pos.y += this.dy;
        } else if ( this.type == GLOBALS.NPC.TYPE.FATHER ||
                    this.type == GLOBALS.NPC.TYPE.MOTHER){
            if (this.state == GLOBALS.NPC.STATE.IN){
                this.pos.y += this.dy;
                if (this.pos.y > GLOBALS.G_HEIGHT / 2){
                    this.state = GLOBALS.NPC.STATE.NORMAL;
                    this.shot_cooldown = 0;
                }
            } else if (this.state == GLOBALS.NPC.STATE.NORMAL){
                this.shot_cooldown -= 1;
                if (this.shot_cooldown <= 0){
                    this.shot_cooldown = 10;
                    const blt = new Bullet(this.scene);
                    let bltpos = this.pos.clone();
                    bltpos.y -= this.size / 2;
                    blt.setType(GLOBALS.BULLET.TYPE.PARENT, bltpos);
                    GameState.npc_bullets.push(blt);
                }
                this.lifespan -= 1;
                if (this.lifespan <= 0){
                    this.state = GLOBALS.NPC.STATE.OUT;
                    this.dx = this.pos.x > GLOBALS.G_WIDTH / 2 ? 1 : -1;
                    this.sprite.setAlpha(0.5);
                }
            } else if (this.state == GLOBALS.NPC.STATE.OUT){
                this.pos.x += this.dx
            }
        } else if ( this.type == GLOBALS.NPC.TYPE.OLD){

        } else if ( this.type == GLOBALS.NPC.TYPE.BOSS){

        } else if ( this.type == GLOBALS.NPC.TYPE.DISASTER){

        }

        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);
        // 画面外に出たら削除対象
        if (this.pos.y < -10 || this.pos.y > GLOBALS.G_HEIGHT + 10 ||
            this.pos.x < -100 || this.pos.x > GLOBALS.G_WIDTH + 100)
            this.alive = false;
    }

    draw(graphics) {

    }

    hit(){
        // [TODO] hp減らす
        // [TODO] ノックバック
        return this.hp;
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