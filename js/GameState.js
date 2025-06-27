// GameState.js
import { GLOBALS } from './GameConst.js';

export const  GameState = {
    // グローバル変数
    ff : 1.0,
    isPortrait : false,
    pos : GLOBALS.POS.MAX,
    married : false,
    ending : null,
    bg : null,
    score : 0,
    camera : null,
    sound : null,
    debug : false,

    // 表示オブジェクト管理
    player : null,
    npcs : [],
    player_bullets : [],
    npc_bullets : [],
    items : [],
    effects : [],

    // ゲームクリア画面用の集計値
    e_enemy : 0,
    e_love : 0,
    e_encourage : 0,
    e_money : 0,
    e_virtue : 0,

    reset(){
        this.pos = GLOBALS.POS.MAX;
        this.married = false;
        this.ending = null;
        this.score = 0;

        this.e_enemy = 0;
        this.e_love = 0;
        this.e_encourage = 0;
        this.e_money = 0;
        this.e_virtue = 0;
    },

    reset_camera(){
        if (this.isPortrait){
            this.camera = {
                position: new Phaser.Math.Vector3(GLOBALS.CAMERA_P.X, GLOBALS.CAMERA_P.Y, GLOBALS.CAMERA_P.Z),
                rotation: { upDown: GLOBALS.CAMERA_P.UPDOWN, rightLeft: GLOBALS.CAMERA_P.RIGHTLEFT, roll: GLOBALS.CAMERA_P.ROLL }
            };
        } else {
            GameState.camera = {
                position: new Phaser.Math.Vector3(GLOBALS.CAMERA.X, GLOBALS.CAMERA.Y, GLOBALS.CAMERA.Z),
                rotation: { upDown: GLOBALS.CAMERA.UPDOWN, rightLeft: GLOBALS.CAMERA.RIGHTLEFT, roll: GLOBALS.CAMERA.ROLL }
            };
        }
    }
};