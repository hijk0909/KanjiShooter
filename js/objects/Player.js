// Player.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyDraw } from '../utils/DrawUtils.js';
import { MyMath } from '../utils/MathUtils.js';

import { Bullet } from '../objects/Bullet.js';
import { Option } from '../objects/Option.js';

const COOLDOWN_INTERVAL = 11; //連射間隔
const CONFUSED_PERIOD = 60; //混乱時間
const SENSITIVITY = 1.5; //ドラッグ操作に対する自機移動の敏感性
const ORIGINAL_SIZE = 64;

export class Player {
    constructor(scene){
        this.scene = scene;

        this.size = 40;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.speed = 1;
        this.energy = 0;
        this.bullet_type = GLOBALS.BULLET.TYPE.PLAYER_L;
        this.shooting = false;
        this.cooldown = 0;
        this.max_shot = 1;
        this.collision = new Phaser.Geom.Rectangle(-this.size /2 , -this.size /2, this.size, this.size);  // 中心からの相対矩形
        this.isConfused = false;
        this.confused_count = CONFUSED_PERIOD;
        this.alive = true;

        this.options = [];
        this.trace_buffer = null;

        this.graphics = this.scene.add.graphics(); 
        this.marker = new Marker(this.graphics);
    }

    setPos(pos){
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.trace_buffer = new TraceBuffer(pos);
        this.alive = true;
        this.sprite = this.scene.add.sprite(pos.x, pos.y, 'p').setDepth(0);
        MyDraw.set_glow(this.scene, this.sprite, 0xffffee);
    }

    add_option(type, pos, op_num){
        const opt = new Option(this.scene);
        opt.setType(type, pos, op_num);
        this.options.push(opt);
    }

    move(my_input){

        if (this.isConfused){
            this.confused_count -= 1 * GameState.ff;
            if (this.confused_count <= 0){
                this.isConfused = false;
            }
            return;
        }

        let isMoving = false;

        if (my_input.dx != 0 || my_input.dy != 0){
            // マウス・タッチによる移動
            const dx = my_input.dx * SENSITIVITY;
            const dy = my_input.dy * SENSITIVITY;
            this.pos.x = Math.max(this.size /2, Math.min(GLOBALS.G_WIDTH - this.size /2,
                this.pos.x + dx ));
            this.pos.y = Math.max(this.size /2, Math.min(GLOBALS.G_HEIGHT - this.size /2, 
                this.pos.y + dy ));
            isMoving = true;
        } else {
            // 十字キーによる移動
            let dx = 0;
            let dy = 0;
            if (my_input.up){dy = -1;}
            if (my_input.down){dy = 1;}
            if (my_input.left){dx = -1;}
            if (my_input.right){dx = 1;}
            this.pos.x = Math.max(this.size /2, Math.min(GLOBALS.G_WIDTH - this.size /2,
                this.pos.x + dx * this.speed * GameState.ff));
            this.pos.y = Math.max(this.size /2, Math.min(GLOBALS.G_HEIGHT - this.size /2, 
                this.pos.y + dy * this.speed * GameState.ff));
            if ( dx != 0 || dy != 0){ isMoving = true;}
        }

        // 軌跡の記録
        if ( isMoving ){
            this.trace_buffer.push(this.pos.x, this.pos.y, GameState.ff);
        }
        // オプションの制御（逆順）
        for ( let i = this.options.length - 1; i >= 0; i--){
            const pos = this.trace_buffer.findPoint(this.options[i].trace_time_diff);
            this.options[i].update(pos);
            if (!this.options[i].isAlive()){
                this.options[i].destroy();
                this.options.splice(i,1);
            }
        }
    }

    shoot(player_bullets, fire_a, fire_b){
        if ((fire_a || fire_b) && ! this.isConfused){
            if (fire_a){
                this.bullet_type = GLOBALS.BULLET.TYPE.PLAYER_A;
            } else if (fire_b){
                this.bullet_type = GLOBALS.BULLET.TYPE.PLAYER_L;
            }
            // console.log("bullet_type", this.bullet_type, this.cooldown);
            if (this.cooldown <= 0){
                if (this.bullet_type === GLOBALS.BULLET.TYPE.PLAYER_L){
                    let num = 0;
                    for (const bullet of player_bullets){
                        if (bullet.op === 1){ num += 1;}
                    }
                    if (num < this.max_shot){
                        const blt = new Bullet(this.scene);
                        let bltpos = this.pos.clone();
                        bltpos.y -= this.size / 2;
                        blt.setType(GLOBALS.BULLET.TYPE.PLAYER_L, bltpos);
                        blt.set_op(1);
                        player_bullets.push(blt);
                        this.add_energy(-0.5);
                        GameState.sound.se_shot_love.play();
                    }
                } else {
                    let num = 0;
                    for (const bullet of player_bullets){
                        if (bullet.op === 1){ num += 1;}
                    }
                    if (num < this.max_shot){
                        const blt = new Bullet(this.scene);
                        let bltpos = this.pos.clone();
                        bltpos.y -= this.size / 2;
                        blt.setType(GLOBALS.BULLET.TYPE.PLAYER_A, bltpos);
                        blt.set_op(1);
                        player_bullets.push(blt);
                        this.add_energy(-0.5);
                        GameState.sound.se_shot_attack.play();
                    }
                    // オプションからの発射
                    this.options.forEach((option, i) => {
                        let num = 0;
                        for (const bullet of player_bullets){
                            if (bullet.op === i + 2){ num += 1;}
                        }
                        if (num < this.max_shot && option.state != GLOBALS.OPTION.STATE.OUT){
                            const blt = new Bullet(this.scene);
                            let bltpos = option.pos.clone();
                            bltpos.y -= option.size / 2;
                            blt.setType(GLOBALS.BULLET.TYPE.PLAYER_A, bltpos);
                            blt.set_op(i+2);
                            player_bullets.push(blt);
                        }
                    });
                }
                this.cooldown = COOLDOWN_INTERVAL;
            }
        } else {
            this.cooldown = 0;
        }
    }

    update() {
        // 連射間隔
        this.cooldown = Math.max(0, this.cooldown - 1 * GameState.ff);
        // スプライトの更新
        if (this.isConfused){
            let pos = this.pos.clone();
            pos.x += Math.floor(Math.random()*3) - 1;
            pos.y += Math.floor(Math.random()*3) - 1;
            MyDraw.updateSprite(this.sprite, pos, this.size / ORIGINAL_SIZE);
        } else {
            MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);
        }

        this.graphics.clear();
        // マーカーの描画
        this.marker.update(this.pos);
    }

    add_energy(energy){
        this.energy += energy;
        this.energy = Math.min(100, this.energy);
        this.energy = Math.max(0, this.energy);
        this.speed = 1 + 5 * (this.energy / 100);
        this.max_shot = 1 + Math.floor(3 * (this.energy  / 100));
    }

    confuse(){
        this.isConfused = true;
        this.confused_count = CONFUSED_PERIOD;
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

// マーカー
class Marker {

    constructor(graphics){
        this.graphics = graphics;
        this.counter = 0;
        this.max_counter = 100;
    }

    update(pos){
        this.counter += GameState.ff;
        if (this.counter > this.max_counter){
            this.counter = 0;
        }

        const p = new Phaser.Math.Vector3(pos.x,pos.y,0);
        const res = MyMath.projectPoint(p, GameState.camera);
        const { screenPosition : sp } = res;
        const alpha = (this.max_counter - this.counter) / this.max_counter;
        const radius = this.counter;

        this.graphics.lineStyle(4, 0xffff88, alpha);
        this.graphics.strokeCircle(sp.x, sp.y, radius);

    }
}

// 軌跡の管理
class TraceBuffer {

    constructor(pos){
        this.TRACE_MAX = 100;
        this.trace = Array.from({ length: this.TRACE_MAX }, () => ({ x : pos.x, y : pos.y, dt : 1 }));
        this.traceIdx = 0;  //次に書き込むスロット
    }

    push(x, y, dt){
        this.trace[this.traceIdx] = { x, y, dt };
        this.traceIdx = (this.traceIdx + 1) % this.TRACE_MAX;
        // console.log("TraceBuffer.push",x,y,dt);
    }

    // t * (1/60)前の時間の軌跡の座標を取り出す
    findPoint(t){
        // console.log("findPoint start : ",t);
        let sum = 0;
        for ( let i = 0, idx = (this.traceIdx - 1 + this.TRACE_MAX) % this.TRACE_MAX;
          i < this.TRACE_MAX;
          i++, idx = (idx - 1 + this.TRACE_MAX) % this.TRACE_MAX) {
            const { x, y, dt } = this.trace[idx];
            sum += dt;
            if (sum > t) {
                // console.log("findPoint success - ", t, sum, i);
                return new Phaser.Math.Vector2(x, y);
            }
        }
        // console.log("findPoint failed - ", t, sum);
        return GameState.player.pos;           
    }
}