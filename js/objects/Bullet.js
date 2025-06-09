// Bullet.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyDraw } from '../utils/DrawUtils.js';
import { MyMath } from '../utils/MathUtils.js';

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
            MyDraw.set_glow(this.scene, this.sprite, 0x88ffff);
            this.size = 36;
            this.speed = 9;
            this.dx = 0;
            this.dy = -1;
        } else if ( this.type === GLOBALS.BULLET.TYPE.PLAYER_A){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bpa');
            MyDraw.set_glow(this.scene, this.sprite, 0xff8800);
            this.size = 36;
            this.speed = 9;
            this.dx = 0;
            this.dy = -1;
        } else if ( this.type === GLOBALS.BULLET.TYPE.FRIEND){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bf');
            this.size = 30;
            this.speed = 6;
            this.dx = 0;
            this.dy = -1;
        } else if ( this.type === GLOBALS.BULLET.TYPE.ENEMY){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'be');
            this.size = 30;
            this.speed = 4 + GameState.player.energy / 50;
            this.aim(GameState.player.pos);
            this.shoot_cooldown = Math.random() * 60;
        } else if ( this.type === GLOBALS.BULLET.TYPE.PARENT){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bpar');
            this.size = 36;
            this.speed = 8;
            this.dx = 0;
            this.dy = 1;
        } else if ( this.type === GLOBALS.BULLET.TYPE.ILL){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bill');
            this.size = 30;
            this.speed = 3;
            this.aim(GameState.player.pos);
            this.count = 180;
        } else if ( this.type === GLOBALS.BULLET.TYPE.VIRTUE){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bvirtue');
            this.size = 40;
            this.speed = 2;
            this.aim(GameState.player.pos);
            this.count = 120;
        } else if ( this.type === GLOBALS.BULLET.TYPE.CONFU){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bconfu');
            this.size = 30;
            this.speed = 2.0;
            this.aim(GameState.player.pos);
            this.state = GLOBALS.BULLET.STATE.PREP;
            this.count = 38;
        } else if ( this.type === GLOBALS.BULLET.TYPE.MONEY){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'bmoney');
            this.size = 40;            
            this.speed = 6;
            this.dx = 0;
            this.dy = -1;
        }

        this.sprite.visible = false;
    }

    aim(pos){
        const dx = pos.x - this.pos.x;
        const dy = pos.y - this.pos.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 0){
            this.dx = dx / dist;
            this.dy = dy / dist;
        } else {
            this.dx = 0;
            this.dy = 1;
        }
    }

    setVelocity(dx, dy){
        this.dx = dx;
        this.dy = dy;
    }

    set_op(op){
        this.op = op;
    }

    update() {
        // (友)-励、(親)-愛、(客)-金
        if (this.type === GLOBALS.BULLET.TYPE.FRIEND ||
            this.type === GLOBALS.BULLET.TYPE.PARENT ||
            this.type === GLOBALS.BULLET.TYPE.MONEY){
                const {dx, dy} = MyMath.rotate_towards_target(
                    this.pos, GameState.player.pos, this.dx, this.dy, 5 * GameState.ff);
                this.dx = dx;
                this.dy = dy;
        // (老) - 病・徳
        } else if ( this.type === GLOBALS.BULLET.TYPE.ILL ||
                    this.type === GLOBALS.BULLET.TYPE.VIRTUE){
            if (this.count > 0){
                this.count -= 1 * GameState.ff;
                const {dx,dy} = MyMath.rotate_towards_target(
                    this.pos, GameState.player.pos, this.dx, this.dy, 1 * GameState.ff);
                this.dx = dx;
                this.dy = dy;
            }
        // (魔) - 惑
        } else if ( this.type === GLOBALS.BULLET.TYPE.CONFU){
            if (this.state === GLOBALS.BULLET.STATE.PREP){
                this.count -= 1 * GameState.ff;
                if (this.count <= 0){
                    this.count = 45;
                    this.state = GLOBALS.BULLET.STATE.AIM;
                }
            } else if (this.state === GLOBALS.BULLET.STATE.AIM){
                const {dx,dy} = MyMath.rotate_towards_target(
                    this.pos, GameState.player.pos, this.dx, this.dy, 4 * GameState.ff);
                this.dx = dx;
                this.dy = dy;
                this.speed *= 1.02 ** GameState.ff;
                this.count -= 1 * GameState.ff;
                if (this.count <= 0){
                    this.count = 25;
                    this.state = GLOBALS.BULLET.STATE.ACCEL;
                }
            } else if (this.state === GLOBALS.BULLET.STATE.ACCEL){
                this.speed *= 1.02 ** GameState.ff;
                this.count -= 1 * GameState.ff;
                if (this.count <= 0){
                    this.state = GLOBALS.BULLET.STATE.NORMAL;
                }
            } else if (this.state === GLOBALS.BULLET.STATE.NORMAL){
            }
        }
        // console.log("NPC Bullet",this.type, this.pos, this.dx, this.dy);

        this.pos.x += this.dx * this.speed * GameState.ff;
        this.pos.y += this.dy * this.speed * GameState.ff;
        
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