// Ending.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyDraw } from '../utils/DrawUtils.js';
import { BG } from '../objects/BG.js';

const ORIGINAL_SIZE = 64;
const INIT_YU = -128;
const INIT_YD = GLOBALS.G_HEIGHT + 128;
const INIT_XL = -128;
const INIT_XR = GLOBALS.G_WIDTH + 128;

export class Ending {
    constructor(scene){
        this.scene = scene;
        this.isSetup = false;
        this.isSetup_wipe = false;
        
        this.sprite_partner = null;
        this.sprite_father = null;
        this.sprite_mother = null;
        this.sprite_friends_left = [];
        this.sprite_friends_right = [];
        this.sprite_children = [];
        this.sprite_grandchildren = [];

        this.pos_partner = null;
        this.pos_father = null;
        this.pos_mother = null;
        this.pos_friends_left = [];
        this.pos_friends_right = [];
        this.pos_children = [];
        this.pos_grandchildren = [];

        this.num_child = 0;
        this.num_friend = 0;
        this.friendship = 0;
        this.sprite_partner = null;
        this.pos_partner = null;
        // 臨終のデバッグ用初期設定
        // this.num_child = 3;
        // this.num_friend = 10;
        // this.friendship = 100;
        // this.sprite_partner = this.scene.add.sprite(GLOBALS.G_WIDTH / 2, INIT_YU, 'nw');
        // this.pos_partner = new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, INIT_YU);
        this.count = 0;
    }

    setup(){
        this.count = 0;
        this.sprite_father = this.scene.add.sprite(GLOBALS.G_WIDTH / 2 -200, INIT_YU, 'nfa');
        this.pos_father = new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 -200, INIT_YU);
        this.sprite_mother = this.scene.add.sprite(GLOBALS.G_WIDTH / 2 +200, INIT_YU, 'nma');
        this.pos_mother = new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 +200, INIT_YU);

        this.num_friend = Math.floor(this.friendship / 10);
        if (this.num_friend > 0){
            const unit1 = GLOBALS.G_HEIGHT / (this.num_friend + 1);
            for (let i=0; i < this.num_friend ; i++ ){
                this.sprite_friends_left.push(this.scene.add.sprite(INIT_XL, (i+1)*unit1, 'nf'));
                this.pos_friends_left.push(new Phaser.Math.Vector2(INIT_XL, (i+1)*unit1));
                this.sprite_friends_right.push(this.scene.add.sprite(INIT_XR, (i+1)*unit1, 'nf'));
                this.pos_friends_right.push( new Phaser.Math.Vector2(INIT_XR, (i+1)*unit1));
            }
        }
        if (this.num_child > 0){
            const unit2 = GLOBALS.G_WIDTH / (this.num_child + 1);
            const unit3 = GLOBALS.G_WIDTH / (this.num_child * 2 + 1);
            for (let i=0; i < this.num_child ; i++ ){
                this.sprite_children.push(this.scene.add.sprite((i+1)*unit2, INIT_YD, 'nc'));
                this.pos_children.push(new Phaser.Math.Vector2((i+1)*unit2, INIT_YD));
            }
            for (let i=0; i < this.num_child * 2; i++ ){
                this.sprite_grandchildren.push(this.scene.add.sprite((i+1)*unit3, INIT_YD, 'ngc'));
                this.pos_grandchildren.push(new Phaser.Math.Vector2((i+1)*unit3, INIT_YD));
            }
        }
        this.isSetup = true;
    }

    update(pos) {
        // console.log("Ending update:",pos, GLOBALS.POS.GOAL);
        if ( pos > GLOBALS.POS.GOAL){
            return;
        } else if (!this.isSetup){
            this.setup();
        }

        // 背景色の変更とズームアウト
        if ( pos < GLOBALS.POS.FADE){
            const r = Math.floor(((GLOBALS.POS.FADE - pos) / GLOBALS.POS.FADE) * 255);
            const color = (r << 16) | (r << 8) | r;
            GameState.bg.set_color(color);
            const ratio1 = ((GLOBALS.POS.FADE - pos) / GLOBALS.POS.FADE); // 0 → 1
            const ratio2 = pos / GLOBALS.POS.FADE; // 1 → 0
            const upDown = GLOBALS.CAMERA.UPDOWN * (1 - ratio1 * ratio1);
            const zdist = ratio1 * ratio1 * 500;
            const ydiff = GLOBALS.G_HEIGHT / 2 - GLOBALS.CAMERA.Y;
            const y = GLOBALS.CAMERA.Y + ydiff * ratio1 * ratio1;
            GameState.camera = {
                    position: new Phaser.Math.Vector3(GLOBALS.CAMERA.X, y, GLOBALS.CAMERA.Z - zdist),
                    rotation: { upDown: upDown, rightLeft: GLOBALS.CAMERA.RIGHTLEFT, roll: GLOBALS.CAMERA.ROLL }
            };
        }

        // ワイプアウトの設定
        if ( pos < GLOBALS.POS.WIPEOUT && !this.isSetupWipe){
            this.setup_wipeout();
            this.isSetupWipe = true;
        }

        // 親族の描画
        this.count += 1;
        const diff = Math.max(0, 380 - this.count * 0.8 * GameState.ff);

        this.pos_father.y = 200 - diff;
        MyDraw.updateSprite(this.sprite_father, this.pos_father, 60 / ORIGINAL_SIZE);
        this.pos_mother.y = 200 - diff;
        MyDraw.updateSprite(this.sprite_mother, this.pos_mother, 60 / ORIGINAL_SIZE);
        if (this.sprite_partner){
            this.pos_partner.y = GLOBALS.G_HEIGHT / 2 - 100 - diff;
            MyDraw.updateSprite(this.sprite_partner, this.pos_partner, 60 / ORIGINAL_SIZE);
        }
        if (this.num_friend > 0){
            const fxl = GLOBALS.G_WIDTH / 2 - 180 - diff;
            const fxr = GLOBALS.G_WIDTH / 2 + 180 + diff;
            for (let i=0; i < this.num_friend; i++){
                this.pos_friends_left[i].x = fxl;
                MyDraw.updateSprite(this.sprite_friends_left[i], this.pos_friends_left[i], 40 / ORIGINAL_SIZE);
                this.pos_friends_right[i].x = fxr;
                MyDraw.updateSprite(this.sprite_friends_right[i], this.pos_friends_right[i], 40 / ORIGINAL_SIZE);
            }
        }

        if (this.num_child > 0){
            const cy = GLOBALS.G_HEIGHT - 300 + diff;
            const gcy = GLOBALS.G_HEIGHT - 190 + diff;
            for (let i=0; i < this.num_child; i++){
                this.pos_children[i].y = cy;
                MyDraw.updateSprite(this.sprite_children[i], this.pos_children[i], 50 / ORIGINAL_SIZE);
            }
            for (let i=0; i < this.num_child * 2; i++){
                this.pos_grandchildren[i].y = gcy;
                MyDraw.updateSprite(this.sprite_grandchildren[i], this.pos_grandchildren[i], 40 / ORIGINAL_SIZE);
            }
        }
    }

    setup_wipeout(){
        // ワイプ・アウト
        this.overlay = this.scene.add.rectangle(0, 0, GLOBALS.G_WINDOW_WIDTH, GLOBALS.G_WINDOW_HEIGHT, 0x000000, 1)
            .setOrigin(0)
            .setDepth(900)
            .setAlpha(0);
        let maskGraphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        let mask = maskGraphics.createGeometryMask();
        mask.invertAlpha = true;
        this.overlay.setMask(mask);
        let maskData = { radius: 500 };
        this.scene.tweens.add({
            targets: maskData,
            radius: 1,
            duration: 1000,
            ease: 'Sine.easeOut',
            onUpdate: () => {
                maskGraphics.clear();
                maskGraphics.fillStyle(0xffffff);
                maskGraphics.beginPath();
                maskGraphics.arc(GLOBALS.G_WINDOW_WIDTH / 2, GLOBALS.G_WINDOW_HEIGHT / 2, maskData.radius, 0, Math.PI * 2);
                maskGraphics.fillPath();
            }
        });

        this.scene.tweens.add({
            targets : this.overlay,
            alpha: 1,          // 0→1
            duration: 500,
            ease    : 'Linear'
        });

        // 完了時の後処理
        this.scene.time.delayedCall(2000, () => {
            this.overlay.destroy();
        });
    }

    add_friend(){
        this.friendship += 1;
    }

    set_num_child(num){
        this.num_child = num;
    }

    set_partner(type){
        if (type === GLOBALS.ITEM.TYPE.WIFE){
            this.sprite_partner = this.scene.add.sprite(GLOBALS.G_WIDTH / 2, INIT_YU, 'nw');
            this.pos_partner = new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, INIT_YU);
        } else if (type === GLOBALS.ITEM.TYPE.HUSBAND){
            this.sprite_partner = this.scene.add.sprite(GLOBALS.G_WIDTH / 2, INIT_YU, 'nh');
            this.pos_partner = new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, INIT_YU);
        }
    }

    isAlive() {
        return this.alive;
    }
}