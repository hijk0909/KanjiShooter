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
            this.dy = (Math.random()*1 + 1);
            this.cnt = 0;
            this.shot_cooldown = 0;
        } else if ( this.type == GLOBALS.NPC.TYPE.FRIEND){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cf');
            this.dy = (Math.random()*1 + 1);
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
            this.dy = (Math.random()*0.5 + 0.5);
            this.shot_cooldown = 0;
        } else if ( this.type == GLOBALS.NPC.TYPE.BOSS){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cboss');
            this.size = 120;
            this.pos = new Phaser.Math.Vector2(GLOBALS.G_WIDTH/2, -60);
            this.dy = 2 ;
            this.lifespan = 1000;
            this.hp = 50;
            this.state = GLOBALS.NPC.STATE.IN;
        } else if ( this.type == GLOBALS.NPC.TYPE.DISASTER){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cdisaster');
            const x = Math.random() * GLOBALS.G_WIDTH * 0.6 + GLOBALS.G_WIDTH * 0.2;
            this.size = 60;
            this.pos = new Phaser.Math.Vector2(x, -30);
            this.dy = 5.5;
        } else if ( this.type == GLOBALS.NPC.TYPE.DEVIL){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cdevil');
            this.size = 55;
            this.state = GLOBALS.NPC.STATE.IN;
            this.counter = 100;
        } else if ( this.type == GLOBALS.NPC.TYPE.WALL){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cwall_anim');
            this.size = 45;
            if (!this.scene.anims.exists('cwall_anims')) {
                this.scene.anims.create({key:'cwall_anims',
                    frames: this.scene.anims.generateFrameNumbers('cwall_anim', { start: 0, end: 7 }),
                    frameRate: 8, repeat: -1
                });
            }
            this.sprite.play('cwall_anims');
            this.dy = 1;
            this.counter = 0;
        } else if ( this.type == GLOBALS.NPC.TYPE.BARRIER){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'cbarrier');
            this.size = 50;
            this.dy = 0.8;
            this.shot_cooldown = 0;
            this.counter = 0;
        } else if ( this.type == GLOBALS.NPC.TYPE.CUSTOMER){
            this.sprite = this.scene.add.sprite(pos.x, pos.y, 'ccustomer');
            this.dy = (Math.random()*1 + 1);
        }

        this.sprite.visible = false;
    }

    update() {
        // 敵
        if ( this.type === GLOBALS.NPC.TYPE.ENEMY){
            this.cnt = (this.cnt + 10 > 360) ? this.cnt + 10 * GameState.ff - 360 : this.cnt + 10 * GameState.ff;
            this.pos.x = this.x_center +  10 * Math.cos(MyMath.radians(this.cnt));
            this.pos.y += this.dy * GameState.ff;
            // 弾の発射判定
            this.shot_cooldown -= 1 * GameState.ff;
            if (this.shot_cooldown <= 0){
                this.shot_cooldown = 120;
                // 画面下端でなければ敵弾発射
                if (this.pos.y < GLOBALS.G_HEIGHT * 0.8){
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    GameState.npc_bullets.push(blt);
                }
            }
        // 友
        } else if ( this.type === GLOBALS.NPC.TYPE.FRIEND){
              this.pos.y += this.dy * GameState.ff;
        // 父・母
        } else if ( this.type === GLOBALS.NPC.TYPE.FATHER ||
                    this.type === GLOBALS.NPC.TYPE.MOTHER){
            if (this.state === GLOBALS.NPC.STATE.IN){
                this.pos.y += this.dy * GameState.ff;
                if (this.pos.y > GLOBALS.G_HEIGHT / 2){
                    this.state = GLOBALS.NPC.STATE.NORMAL;
                    this.shot_cooldown = 0;
                }
            } else if (this.state === GLOBALS.NPC.STATE.NORMAL){
                this.shot_cooldown -= 1 * GameState.ff;
                if (this.shot_cooldown <= 0){
                    this.shot_cooldown = 10;
                    const blt = new Bullet(this.scene);
                    let bltpos = this.pos.clone();
                    bltpos.y -= this.size / 2;
                    blt.setType(GLOBALS.BULLET.TYPE.PARENT, bltpos);
                    GameState.npc_bullets.push(blt);
                }
                this.lifespan -= 1 * GameState.ff;
                if (this.lifespan <= 0){
                    this.state = GLOBALS.NPC.STATE.OUT;
                    this.dx = this.pos.x > GLOBALS.G_WIDTH / 2 ? 1 : -1;
                    this.sprite.setAlpha(0.5);
                }
            } else if (this.state === GLOBALS.NPC.STATE.OUT){
                this.pos.x += this.dx * GameState.ff;
            }
        // 老
        } else if ( this.type === GLOBALS.NPC.TYPE.OLD){
            // 弾の発射判定
            this.shot_cooldown -= 1 * GameState.ff;
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
            this.pos.x += this.dx * GameState.ff;
            this.pos.y += this.dy * GameState.ff;
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
                this.shot_cooldown -= 1 * GameState.ff;
                if (this.shot_cooldown <= 0){
                    this.shot_cooldown = 25;

                    let blt = null;
                    let angle = 0;

                    blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    angle = MyMath.target_angle(this.pos, GameState.player.pos, MyMath.radians(-10));
                    blt.setVelocity(Math.cos(angle), Math.sin(angle));
                    GameState.npc_bullets.push(blt);

                    blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    angle = MyMath.target_angle(this.pos, GameState.player.pos, MyMath.radians(+10));
                    blt.setVelocity(Math.cos(angle), Math.sin(angle));
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
            this.pos.x += this.dx * GameState.ff;
            this.pos.y += this.dy * GameState.ff;
        // 災
        } else if ( this.type == GLOBALS.NPC.TYPE.DISASTER){
            if (this.pos.y > GLOBALS.G_HEIGHT / 2){
                for (let angle = 0; angle < 360; angle += 30){
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    const rad = MyMath.radians(angle);
                    blt.setVelocity(Math.cos(rad), Math.sin(rad));
                    GameState.npc_bullets.push(blt);                    
                }
                for (let angle = 45; angle < 360; angle += 90){
                    const blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ILL, this.pos);
                    const rad = MyMath.radians(angle);
                    blt.setVelocity(Math.cos(rad), Math.sin(rad));
                    GameState.npc_bullets.push(blt);                     
                }
                this.alive = false;
            }
            this.pos.x += this.dx * GameState.ff;
            this.pos.y += this.dy * GameState.ff;
        // 魔
        } else if ( this.type == GLOBALS.NPC.TYPE.DEVIL){
            if ( this.state == GLOBALS.NPC.STATE.IN){
                this.counter -= 1 * GameState.ff;
                this.sprite.setAlpha((100 - this.counter)/100);
                if (this.counter <= 0){
                    this.state = GLOBALS.NPC.STATE.NORMAL;
                    this.counter = 20;
                }
            } else if ( this.state == GLOBALS.NPC.STATE.NORMAL){
                this.counter -= 1 * GameState.ff;
                if (this.counter <=0){
                    this.state = GLOBALS.NPC.STATE.OUT;
                    this.counter = 100;
                    for (let angle = 0; angle < 360; angle += 45){
                        const blt = new Bullet(this.scene);
                        blt.setType(GLOBALS.BULLET.TYPE.CONFU, this.pos);
                        const rad = MyMath.radians(angle);
                        blt.setVelocity(Math.cos(rad), Math.sin(rad));
                        GameState.npc_bullets.push(blt);                    
                    }
                }
            } else if ( this.state == GLOBALS.NPC.STATE.OUT ){
                this.counter -= 1 * GameState.ff;
                this.sprite.setAlpha(this.counter/100);
                if (this.counter <=0){
                    this.alive = false;
                }
            }
        // 壁
        } else if ( this.type == GLOBALS.NPC.TYPE.WALL){
            this.pos.y += this.dy * GameState.ff;

        // 障
        } else if ( this.type == GLOBALS.NPC.TYPE.BARRIER){
            this.pos.y += this.dy * GameState.ff;

            this.counter = (this.counter + 3 * GameState.ff) % 360;            
            this.sprite.angle = Math.sin(MyMath.radians(this.counter)) * 45;

            this.shot_cooldown -= 1 * GameState.ff;
            if (this.shot_cooldown <= 0){
                this.shot_cooldown = 180;

                let blt = null;
                let angle = 0;

                // マルチウェイ弾
                blt = new Bullet(this.scene);
                blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                angle = MyMath.target_angle(this.pos, GameState.player.pos, 0);
                blt.setVelocity(Math.cos(angle), Math.sin(angle));
                GameState.npc_bullets.push(blt); 

                for (let i = 0 ; i < GameState.player.options.length ; i++){
                    blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    angle = MyMath.target_angle(this.pos, GameState.player.pos, MyMath.radians(30*(i+1)));
                    blt.setVelocity(Math.cos(angle), Math.sin(angle));
                    GameState.npc_bullets.push(blt);   

                    blt = new Bullet(this.scene);
                    blt.setType(GLOBALS.BULLET.TYPE.ENEMY, this.pos);
                    angle = MyMath.target_angle(this.pos, GameState.player.pos, MyMath.radians(-30*(i+1)));
                    blt.setVelocity(Math.cos(angle), Math.sin(angle));
                    GameState.npc_bullets.push(blt);
                }

            }
        // 客
        } else if ( this.type == GLOBALS.NPC.TYPE.CUSTOMER){
            this.pos.y += this.dy * GameState.ff;
        }

        MyDraw.updateSprite(this.sprite, this.pos, this.size / ORIGINAL_SIZE);
        // 画面外に出たら削除対象
        if (this.pos.y < -100 || this.pos.y > GLOBALS.G_HEIGHT + 10 ||
            this.pos.x < -100 || this.pos.x > GLOBALS.G_WIDTH + 100)
            this.alive = false;
    }

    hit(){
        if (this.pos.y > GLOBALS.G_HEIGHT / 5){
            if (this.type == GLOBALS.NPC.TYPE.BOSS ||
                this.type == GLOBALS.NPC.TYPE.FRIEND){
                this.pos.y -= 8; // * GameState.ff;
            }
        }
        if (this.type == GLOBALS.NPC.TYPE.BOSS){
            this.hp -= 1;
        }
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