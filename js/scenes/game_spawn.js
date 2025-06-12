// game_spawn.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { Item } from '../objects/Item.js';
import { NPC } from '../objects/NPC.js';

export class Spawn {
    constructor(scene) {
        this.scene = scene;

        // 固定座標・アイテム
        this.item_gpos = [
            { gpos: GLOBALS.POS.MAX * 0.88, type: GLOBALS.ITEM.TYPE.POISON },
            { gpos: GLOBALS.POS.MAX * 0.82, type: GLOBALS.ITEM.TYPE.WIFE },
            { gpos: GLOBALS.POS.MAX * 0.82, type: GLOBALS.ITEM.TYPE.HUSBAND },
            { gpos: GLOBALS.POS.MAX * 0.75, type: GLOBALS.ITEM.TYPE.CHILD },
            { gpos: GLOBALS.POS.MAX * 0.70, type: GLOBALS.ITEM.TYPE.CHILD },
            { gpos: GLOBALS.POS.MAX * 0.65, type: GLOBALS.ITEM.TYPE.CHILD },
            { gpos: GLOBALS.POS.MAX * 0.55, type: GLOBALS.ITEM.TYPE.POISON },
            { gpos: GLOBALS.POS.MAX * 0.25, type: GLOBALS.ITEM.TYPE.FORCE }
        ];

        // 固定座標・NPC
        this.npc_gpos = [
            { gpos: GLOBALS.POS.MAX * 0.989, type: GLOBALS.NPC.TYPE.FATHER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 200, 0) },
            { gpos: GLOBALS.POS.MAX * 0.989, type: GLOBALS.NPC.TYPE.MOTHER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 200, 0) },
            { gpos: GLOBALS.POS.MAX * 0.94, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 -250 - 36, 0) }, //壁
            { gpos: GLOBALS.POS.MAX * 0.94, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 -250, 0) }, //壁
            { gpos: GLOBALS.POS.MAX * 0.94, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 -250 + 36, 0) }, //壁
            { gpos: GLOBALS.POS.MAX * 0.94, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 +250 - 36, 0) }, //壁
            { gpos: GLOBALS.POS.MAX * 0.94, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 +250, 0) }, //壁
            { gpos: GLOBALS.POS.MAX * 0.94, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 +250 + 36, 0) }, //壁
            { gpos: GLOBALS.POS.MAX * 0.90, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 250, 0) }, //障
            { gpos: GLOBALS.POS.MAX * 0.90, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 250, 0) }, //障

            { gpos: GLOBALS.POS.MAX * 0.87,  type: GLOBALS.NPC.TYPE.DEVIL,
            pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, GLOBALS.G_HEIGHT / 3) }, //魔
            { gpos: GLOBALS.POS.MAX * 0.84,  type: GLOBALS.NPC.TYPE.DEVIL,
            pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 100, GLOBALS.G_HEIGHT / 2) }, //魔-左
            { gpos: GLOBALS.POS.MAX * 0.84,  type: GLOBALS.NPC.TYPE.DEVIL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 100, GLOBALS.G_HEIGHT / 2) }, //魔-右
            { gpos: GLOBALS.POS.MAX * 0.81,  type: GLOBALS.NPC.TYPE.DEVIL,
            pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 200, GLOBALS.G_HEIGHT / 2) }, //魔-左
            { gpos: GLOBALS.POS.MAX * 0.81,  type: GLOBALS.NPC.TYPE.DEVIL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, GLOBALS.G_HEIGHT / 2) }, //魔-中
            { gpos: GLOBALS.POS.MAX * 0.81,  type: GLOBALS.NPC.TYPE.DEVIL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 180, GLOBALS.G_HEIGHT / 2) }, //魔-右

            { gpos: GLOBALS.POS.MAX * 0.75, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 200, 0) }, //障-左
            { gpos: GLOBALS.POS.MAX * 0.75, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 200, 0) }, //障-右
            { gpos: GLOBALS.POS.MAX * 0.70, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 200, 0) }, //障-左
            { gpos: GLOBALS.POS.MAX * 0.70, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 200, 0) }, //障-右
            { gpos: GLOBALS.POS.MAX * 0.65, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 200, 0) }, //障-左
            { gpos: GLOBALS.POS.MAX * 0.65, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 200, 0) }, //障-右
            { gpos: GLOBALS.POS.MAX * 0.60, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 200, 0) }, //障-左
            { gpos: GLOBALS.POS.MAX * 0.60, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 200, 0) }, //障-右

            { gpos: GLOBALS.POS.MAX * 0.56,  type: GLOBALS.NPC.TYPE.BOSS,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, 0) }, // 悪（ボス）
            { gpos: GLOBALS.POS.MAX * 0.44,  type: GLOBALS.NPC.TYPE.DEVIL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, GLOBALS.G_HEIGHT / 2) }, // 魔
            { gpos: GLOBALS.POS.MAX * 0.40,  type: GLOBALS.NPC.TYPE.DISASTER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, 0) }, // 災1
            { gpos: GLOBALS.POS.MAX * 0.30,  type: GLOBALS.NPC.TYPE.DISASTER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, 0) }, // 災2
            { gpos: GLOBALS.POS.MAX * 0.20,  type: GLOBALS.NPC.TYPE.DISASTER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, 0) }, // 災3
            { gpos: GLOBALS.POS.MAX * 0.18,  type: GLOBALS.NPC.TYPE.DEVIL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, GLOBALS.G_HEIGHT / 2) }, // 魔
            { gpos: GLOBALS.POS.MAX * 0.16, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 200, 0) }, //壁-左１
            { gpos: GLOBALS.POS.MAX * 0.15, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 150, 0) }, //壁-左2
            { gpos: GLOBALS.POS.MAX * 0.14, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 - 100, 0) }, //壁-左3
            { gpos: GLOBALS.POS.MAX * 0.16, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 200, 0) }, //壁-右1
            { gpos: GLOBALS.POS.MAX * 0.15, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 150, 0) }, //壁-右2
            { gpos: GLOBALS.POS.MAX * 0.14, type: GLOBALS.NPC.TYPE.WALL,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 + 100, 0) }, //壁-右3
            { gpos: GLOBALS.POS.MAX * 0.13, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 -250, 0) }, //障-左
            { gpos: GLOBALS.POS.MAX * 0.13, type: GLOBALS.NPC.TYPE.BARRIER,
                pos: new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2 +250, 0) }, //障-右
        ];

        // エリア指定・NPC
        // POS.UNIT = 960 が 10歳の目安
        this.npc_garea = [
            { gpos: GLOBALS.POS.MAX * 0.99, area: 320, interval: 130,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.95, area: 400, interval: 100,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.90, area: 780, interval: 80,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.89, area: 780, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
            { gpos: GLOBALS.POS.MAX * 0.80, area: 780, interval: 45,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.79, area: 780, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
            { gpos: GLOBALS.POS.MAX * 0.78, area: 4000, interval: 370,
                type: GLOBALS.NPC.TYPE.CUSTOMER }, //「客」・出現開始
            { gpos: GLOBALS.POS.MAX * 0.70, area: 1450, interval: 60,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.69, area: 1650, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
            { gpos: GLOBALS.POS.MAX * 0.51, area: 1150, interval: 45,
                type: GLOBALS.NPC.TYPE.ENEMY }, // ボス後の敵
            { gpos: GLOBALS.POS.MAX * 0.49, area: 1150, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
             { gpos: GLOBALS.POS.MAX * 0.48, area: 120, interval: 30,
                type: GLOBALS.NPC.TYPE.WALL }, //ボス後 -「壁」
            { gpos: GLOBALS.POS.MAX * 0.40, area: 560, interval: 40,
                type: GLOBALS.NPC.TYPE.ENEMY }, //「壁」後の -「敵」
            { gpos: GLOBALS.POS.MAX * 0.34, area: 560, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
            { gpos: GLOBALS.POS.MAX * 0.33, area: 560, interval: 300,
                type: GLOBALS.NPC.TYPE.OLD }, //「老」・初登場
            { gpos: GLOBALS.POS.MAX * 0.28, area: 710, interval: 90,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.27, area: 710, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
            { gpos: GLOBALS.POS.MAX * 0.26, area: 710, interval: 180,
                type: GLOBALS.NPC.TYPE.OLD },
            { gpos: GLOBALS.POS.MAX * 0.19, area: 550, interval: 120,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.18, area: 550, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
            { gpos: GLOBALS.POS.MAX * 0.17, area: 550, interval: 90,
                type: GLOBALS.NPC.TYPE.OLD },
            { gpos: GLOBALS.POS.MAX * 0.12, area: 400, interval: 200,
                type: GLOBALS.NPC.TYPE.ENEMY },
            { gpos: GLOBALS.POS.MAX * 0.11, area: 400, interval: 150,
                type: GLOBALS.NPC.TYPE.FRIEND },
            { gpos: GLOBALS.POS.MAX * 0.13, area: 400, interval: 45,
                type: GLOBALS.NPC.TYPE.OLD }
        ];

        this.npc_area_spawns = [];

        this.last_pos_item_pos = GLOBALS.POS.MAX;
        this.last_pos_npc_pos = GLOBALS.POS.MAX;
        this.last_pos_npc_area = GLOBALS.POS.MAX;
    }

    // アイテムの生成（座標）
    item_pos(pos){
        if (pos < this.last_pos_item_pos){
            for (let i = 0; i < this.item_gpos.length; i++) {
                const itemgp = this.item_gpos[i];
                if (itemgp.gpos >= pos && itemgp.gpos < this.last_pos_item_pos) {
                    if (itemgp.type == GLOBALS.ITEM.TYPE.CHILD && !GameState.married){
                        continue; // 結婚していない時は子供は生成しない
                    }
                    const item = new Item(this.scene);
                    item.setType(itemgp.type, new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, 0));
                    GameState.items.push(item);
                }
            }
            this.last_pos_item_pos = pos;
        }
    }

    // NPCの生成（座標）
    npc_pos(pos){
        if (pos < this.last_pos_npc_pos){
            for (let i = 0; i < this.npc_gpos.length; i++) {
                const npcgp = this.npc_gpos[i];
                if (npcgp.gpos >= pos && npcgp.gpos < this.last_pos_npc_pos) {
                    const npc = new NPC(this.scene);
                    npc.setType(npcgp.type, npcgp.pos);
                    GameState.npcs.push(npc);
                }
            }
            this.last_pos_npc_pos = pos;
        }
    }

    // NPCの生成（エリア）
    npc_area(pos){
        if (pos < this.last_pos_npc_area){
            for (let i = 0; i < this.npc_garea.length; i++) {
                const npcga = this.npc_garea[i];
                if (npcga.gpos >= pos && npcga.gpos < this.last_pos_npc_area) {
                    const npcasp = new npc_area_spawn(this.scene);
                    npcasp.setType(npcga.type, npcga.area, npcga.interval);
                    this.npc_area_spawns.push(npcasp);
                }
            }
            this.last_pos_npc_area = pos;
        }
        for (let i = this.npc_area_spawns.length - 1; i >= 0; i--) {
            const npcasp = this.npc_area_spawns[i];
            if (!npcasp.update()){
                this.npc_area_spawns.splice(i, 1);
            }
        }
    }
}

class npc_area_spawn {
    constructor(scene){
        this.scene = scene;
        this.type = GLOBALS.NPC.TYPE.ENEMY;
        this.area = 100;
        this.interval = 10;
        this.counter = 0;
    }

    setType(type,area,interval){
        this.type = type;
        this.area = area;
        this.interval = interval;
        this.counter = interval;
    }

    update(){
        this.area -= 1 * GameState.ff;
        if (this.area <= 0){
            return false;
        }
        this.counter -= 1 * GameState.ff;
        if (this.counter <= 0){
            this.counter = this.interval;
            const npc = new NPC(this.scene);
            const x = Math.random() * GLOBALS.G_WIDTH * 0.6 + GLOBALS.G_WIDTH * 0.2
            npc.setType(this.type, new Phaser.Math.Vector2(x,0));
            GameState.npcs.push(npc);
        }
        return true;
    }
}