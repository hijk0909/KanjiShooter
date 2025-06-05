// Ending.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyDraw } from '../utils/DrawUtils.js';

const ORIGINAL_SIZE = 64;
const INIT_YU = -128;
const INIT_YD = GLOBALS.G_HEIGHT + 128;
const INIT_XL = -128;
const INIT_XR = GLOBALS.G_WIDTH + 128;

export class Ending {
    constructor(scene){
        this.scene = scene;
        
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
    }

    update(pos) {
        // console.log("Ending update:",pos, GLOBALS.POS.GOAL);
        if ( pos > GLOBALS.POS.GOAL){
            return;
        } else if (pos === GLOBALS.POS.GOAL){
            this.setup();
        }

        this.count += 1;
        const diff = Math.max(0, 380 - this.count * 0.8);

        this.pos_father.y = 100 - diff;
        MyDraw.updateSprite(this.sprite_father, this.pos_father, 60 / ORIGINAL_SIZE);
        this.pos_mother.y = 100 - diff;
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

    draw(graphics) {

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