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
    }

    setType(type, pos){
        this.type = type;
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.alive = true;
        this.size = 20;
        this.radius = 10;
        this.num = 8;
        this.sprites = new Array(this.num);

        if (this.type == GLOBALS.EFFECT.TYPE.EXPLOSION){
            for (let i=0;i<this.num;i++){
                this.sprites[i] = this.scene.add.sprite(pos.x, pos.y, 'ex');
            }
        }
    }

    update() {
        if (this.type == GLOBALS.EFFECT.TYPE.EXPLOSION){
            this.radius += 5;
            this.size -= 1;
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
    }

    isAlive() {
        return this.alive;
    }
}