// Effect.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyDraw } from '../utils/DrawUtils.js';
import { MyMath } from '../utils/MathUtils.js';

const ORIGINAL_SIZE = 64;

export class Effect {
    constructor(scene){
        this.scene = scene;
        this.type = null;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.collision = new Phaser.Geom.Rectangle(-20, -20, 40, 40);  // 中心からの相対矩形
        this.alive = true;
        this.sprites = [];
        this.sprite = null;
    }

    setType(type, pos){
        this.type = type;
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.alive = true;

        if (this.type == GLOBALS.EFFECT.TYPE.EXPLOSION){
            this.num = 8;
            this.sprites = new Array(this.num);
            this.size = 30;
            this.radius = 10;
            for (let i=0;i<this.num;i++){
                this.sprites[i] = this.scene.add.sprite(pos.x, pos.y, 'ex');
            }
        } else if (this.type == GLOBALS.EFFECT.TYPE.BLESSING){
            this.num = 30;
            this.sprites = new Array(this.num);
            this.size = 25;
            this.radius = 50;
            this.count = 0;
            this.theta_offset = 0;
            this.start_alpha = 0.5;
            this.alpha = this.start_alpha;
            this.max_count_normal = 150;
            this.max_count_out = 150;
            for (let i=0;i<this.num;i++){
                this.sprites[i] = this.scene.add.sprite(pos.x, pos.y, 'ebl')
                .setAlpha(this.alpha);
            this.state = GLOBALS.EFFECT.STATE.NORMAL;
            }
        } else if (this.type == GLOBALS.EFFECT.TYPE.BLESSING2){
            this.num = 25;
            this.sprites = new Array(this.num);
            this.size = 15;
            this.radius = 10;
            this.theta_offset = 0;
            this.start_alpha = 0.5;
            this.alpha = this.start_alpha;
            this.count = 0;
            this.max_count = 240;
            this.target_obj = null;
            for (let i=0;i<this.num;i++){
                this.sprites[i] = this.scene.add.sprite(pos.x, pos.y, 'ebl')
                .setAlpha(this.alpha);
            }
        } else if (this.type == GLOBALS.EFFECT.TYPE.TIME) {
            this.alpha = 0.6;
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'etime')
                .setAlpha(this.alpha);
            const x = GLOBALS.G_WIDTH * Math.random();
            const y = 0;
            const z = 600 * Math.random() - 300;
            this.size = 20;
            this.pos3 = new Phaser.Math.Vector3(x,y,z);
            // console.log("pos :", this.pos3);
        }
    }

    update() {
        if (this.type == GLOBALS.EFFECT.TYPE.EXPLOSION){
            this.radius += 5 * GameState.ff;
            this.size -= 1 * GameState.ff;
            if (this.size < 5){
                this.alive =false;
            }
            for (let i=0;i<this.num;i++){
                const angle = MyMath.radians(i*45);
                const x = this.pos.x + this.radius * Math.cos(angle);
                const y = this.pos.y + this.radius * Math.sin(angle);
                MyDraw.updateSprite(this.sprites[i], 
                    new Phaser.Math.Vector2(x,y), this.size / ORIGINAL_SIZE);
            }
        } else if (this.type == GLOBALS.EFFECT.TYPE.BLESSING){
            this.count += 1 * GameState.ff;
            if (this.state == GLOBALS.EFFECT.STATE.NORMAL){
                if (this.count >= this.max_count_normal){
                    this.state = GLOBALS.EFFECT.STATE.OUT;
                    this.count = 0;
                }
            } else if (this.state == GLOBALS.EFFECT.STATE.OUT){
                this.radius += 1 * GameState.ff;
                this.alpha = this.start_alpha * (this.max_count_out - this.count) / this.max_count_out;
                if (this.count >= this.max_count_out){
                    this.alive = false;
                }
            }
            this.update_blessing(GameState.player.pos);
        } else if (this.type == GLOBALS.EFFECT.TYPE.BLESSING2){
            this.count += 1 * GameState.ff;
            this.radius += 0.2 * GameState.ff;
            this.alpha = this.start_alpha * (this.max_count - this.count) / this.max_count;
                if (this.count >= this.max_count_out){
                    this.alive = false;
                }
            this.update_blessing(this.target_obj.pos);
        } else if (this.type == GLOBALS.EFFECT.TYPE.TIME){
            this.pos3.y += 6 * GameState.ff;
            MyDraw.updateSprite3(this.sprite, this.pos3, this.size / ORIGINAL_SIZE);
            if (this.pos3.y > GLOBALS.G_HEIGHT){
                this.alive = false;
            } 
        }
    }

    set_target_obj(obj){
        this.target_obj = obj;
    }

    update_blessing(p){
        this.theta_offset += 1 * GameState.ff;
        for (let i=0;i<this.num;i++){
            const offset = 2.0 / this.num;
            const y = i * offset - 1.0 + (offset / 2.0);
            const r = Math.sqrt(1.0 - y * y);
            const golden_angle = Math.PI * (3.0 - Math.sqrt(5.0));
            const theta = i * golden_angle;
            const x = r * Math.cos(theta - this.theta_offset * 0.02);
            const z = r * Math.sin(theta - this.theta_offset * 0.02);
            const rad = this.radius;
            const point = new Phaser.Math.Vector3(p.x + x * rad, p.y + y * rad, z * rad);
            this.sprites[i].setAlpha(this.alpha);
            MyDraw.updateSprite3(this.sprites[i], point, this.size / ORIGINAL_SIZE);
        }
    }

    draw(graphics) {

    }

    destroy(){
        if ( this.sprites ){
            for (let i=0;i<this.num;i++){
                this.sprites[i].destroy();
            }
            this.sprites = null;
        }
        if ( this.sprite ){
            this.sprite.destroy();
            this.sprite = null;
        }
    }

    isAlive() {
        return this.alive;
    }
}