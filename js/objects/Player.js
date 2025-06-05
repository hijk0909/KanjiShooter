// Player.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyDraw } from '../utils/DrawUtils.js';
import { Bullet } from '../objects/Bullet.js';
import { Option } from '../objects/Option.js';

const COOLDOWN_INTERVAL = 11; //連射間隔
const ORIGINAL_SIZE = 64;
const TRACE_MAX = 100;

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
        this.alive = true;

        this.options = [];
        this.trace = [];
        this.trace_idx = 0;
    }

    setPos(pos){
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.trace = Array.from({ length: TRACE_MAX }, () => new Phaser.Math.Vector2(pos.x, pos.y));
        this.alive = true;
        this.sprite = this.scene.add.sprite(pos.x, pos.y, 'p').setDepth(0);
    }

    add_option(type, pos, op_num){
        const opt = new Option(this.scene);
        opt.setType(type, pos, op_num);
        this.options.push(opt);
    }

    move(dx,dy){
        // 自機の移動
        this.pos.x = Math.max(this.size /2, Math.min(GLOBALS.G_WIDTH - this.size /2, this.pos.x + dx * this.speed));
        this.pos.y = Math.max(this.size /2, Math.min(GLOBALS.G_HEIGHT - this.size /2, this.pos.y + dy * this.speed));
        // 軌跡の記録
        if ( dx != 0 || dy != 0){
            this.trace[this.trace_idx] = this.pos.clone();
            this.trace_idx = (this.trace_idx + 1) % TRACE_MAX;
        }
        // オプションの制御（逆順）
        for ( let i = this.options.length - 1; i >= 0; i--){
            const pos = this.trace[ ((this.trace_idx - this.options[i].trace_pos + TRACE_MAX) % TRACE_MAX) ];
            this.options[i].update(pos);
            if (!this.options[i].isAlive()){
                this.options[i].destroy();
                this.options.splice(i,1);
            }
        }
    }

    shoot(player_bullets, fire_a, fire_b){
        if (fire_a || fire_b){
            if (fire_a){
                this.bullet_type = GLOBALS.BULLET.TYPE.PLAYER_A;
            } else if (fire_b){
                this.bullet_type = GLOBALS.BULLET.TYPE.PLAYER_L;
            }
            // console.log("bullet_type", this.bullet_type, this.cooldown);
            if (this.cooldown === 0){
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
                        this.scene.sound.play('se_shot_love');
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
                        this.scene.sound.play('se_shot_attack');
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
        this.cooldown = Math.max(0, this.cooldown - 1)
        // スプライトの更新
        // this.sprite.setPosition(this.pos.x, this.pos.y);
        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);
    }

    draw(graphics) {

    }

    add_energy(energy){
        this.energy += energy;
        this.energy = Math.min(100, this.energy);
        this.energy = Math.max(0, this.energy);
        this.speed = 1 + 5 * (this.energy / 100);
        this.max_shot = 1 + Math.floor(3 * (this.energy  / 100));
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