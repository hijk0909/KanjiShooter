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
            this.dy = Math.random()*1 + 1;
            this.cnt = 0;
            this.shot_cooldown = 0;
        } else if ( this.type == GLOBALS.NPC.TYPE.FRIEND){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cf');
            this.dy = Math.random()*1 + 1;
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
            this.dy = Math.random()*0.5 + 0.5;
            this.shot_cooldown = 0;
        } else if ( this.type == GLOBALS.NPC.TYPE.BOSS){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cboss');
            this.size = 120;
            this.pos = new Phaser.Math.Vector2(GLOBALS.G_WIDTH/2, -60);
            this.dy = 2;
            this.lifespan = 1000;
            this.hp = 50;
            this.state = GLOBALS.NPC.STATE.IN;
        } else if ( this.type == GLOBALS.NPC.TYPE.DISASTER){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cdisaster');
            const x = Math.random() * GLOBALS.G_WIDTH * 0.6 + GLOBALS.G_WIDTH * 0.2;
            this.size = 60;
            this.pos = new Phaser.Math.Vector2(x, -30);
            this.dy = 5.5;
        }

        this.sprite.visible = false;
    }

    update() {
        // 敵
        if ( this.type === GLOBALS.NPC.TYPE.ENEMY){
            this.cnt = (this.cnt + 10 > 360) ? this.cnt + 10 - 360 : this.cnt + 10;
            this.pos.x = this.x_center +  10 * Math.cos(MyMath.radians(this.cnt));
            this.pos.y += this.dy;
            // 弾の発射判定
            this.shot_cooldown -= 1;
            if (this.shot_cooldown <= 0){
                this.shot_cooldown = 120;
                const blt = new Bullet(this.scene);
                blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                GameState.npc_bullets.push(blt);
            }
        // 友
        } else if ( this.type === GLOBALS.NPC.TYPE.FRIEND){
              this.pos.y += this.dy;
        // 父・母
        } else if ( this.type === GLOBALS.NPC.TYPE.FATHER ||
                    this.type === GLOBALS.NPC.TYPE.MOTHER){
            if (this.state === GLOBALS.NPC.STATE.IN){
                this.pos.y += this.dy;
                if (this.pos.y > GLOBALS.G_HEIGHT / 2){
                    this.state = GLOBALS.NPC.STATE.NORMAL;
                    this.shot_cooldown = 0;
                }
            } else if (this.state === GLOBALS.NPC.STATE.NORMAL){
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
            } else if (this.state === GLOBALS.NPC.STATE.OUT){
                this.pos.x += this.dx
            }
        // 老
        } else if ( this.type === GLOBALS.NPC.TYPE.OLD){
            // 弾の発射判定
            this.shot_cooldown -= 1;
            if (this.shot_cooldown <= 0){
                this.shot_cooldown = 45;
                if (Math.random() < 0.3){
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.VIRTUE, this.pos);
                    GameState.npc_bullets.push(blt);
                } else {
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ILL, this.pos);
                    GameState.npc_bullets.push(blt);
                }
            }
            this.pos.x += this.dx;
            this.pos.y += this.dy;
        // 悪（BOSS）
        } else if ( this.type === GLOBALS.NPC.TYPE.BOSS){
            if ( this.state == GLOBALS.NPC.STATE.IN){
                if (this.pos.y > GLOBALS.G_HEIGHT / 3){
                    this.state = GLOBALS.NPC.STATE.NORMAL;
                    this.dx = Math.random() < 0.5 ? 1 : -1;
                    this.shot_cooldown = 0;
                }
            } else if ( this.state == GLOBALS.NPC.STATE.NORMAL){
                this.dy =  this.pos.y < GLOBALS.G_HEIGHT / 3 ? 1 : 0;
                if (this.pos.x > GLOBALS.G_WIDTH / 2 + 200) {this.dx = -1;}
                if (this.pos.x < GLOBALS.G_WIDTH / 2 - 200) {this.dx = 1;}
                this.shot_cooldown -= 1;
                if (this.shot_cooldown <= 0){
                    this.shot_cooldown = 20;
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    GameState.npc_bullets.push(blt);
                }
                this.lifespan -= 1;
                if (this.lifespan <= 0){
                    this.state = GLOBALS.NPC.STATE.OUT;
                    this.dx = 0;
                    this.dy = -1;
                    this.sprite.setAlpha(0.5);
                }
            } else if ( this.state == GLOBALS.NPC.STATE.OUT ){
            }
            this.pos.x += this.dx;
            this.pos.y += this.dy;
        // 災
        } else if ( this.type == GLOBALS.NPC.TYPE.DISASTER){
            if (this.pos.y > GLOBALS.G_HEIGHT / 2){
                for (let angle = 0; angle < 360; angle += 30){
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    const rad = MyMath.radians(angle);
                    blt.setVelocity(Math.sin(rad), Math.cos(rad));
                    GameState.npc_bullets.push(blt);                    
                }
                for (let angle = 45; angle < 360; angle += 90){
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ILL, this.pos);
                    const rad = MyMath.radians(angle);
                    blt.setVelocity(Math.sin(rad), Math.cos(rad));
                    GameState.npc_bullets.push(blt);                     
                }
                this.alive = false;
            }
            this.pos.x += this.dx;
            this.pos.y += this.dy;
        }

        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);
        // 画面外に出たら削除対象
        if (this.pos.y < -100 || this.pos.y > GLOBALS.G_HEIGHT + 10 ||
            this.pos.x < -100 || this.pos.x > GLOBALS.G_WIDTH + 100)
            this.alive = false;
    }

    draw(graphics) {

    }

    hit(){
        if (this.pos.y > GLOBALS.G_HEIGHT / 5){
            this.pos.y -= 10;
        }
        this.hp -= 1;
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