// GameState.js
import { GLOBALS } from './GameConst.js';

export const  GameState = {
    // グローバル変数
    ff : 1.0,
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
    }
};