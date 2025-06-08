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
    se: null,  //[DEBUG]
    debug : false,

    // 表示オブジェクト管理
    player : null,
    npcs : [],
    player_bullets : [],
    npc_bullets : [],
    items : [],
    effects : [],

    reset(){
        this.pos = GLOBALS.POS.MAX;
        this.married = false;
        this.ending = null;
        this.score = 0;
    }
};