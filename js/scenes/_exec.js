// _exec.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from '../objects/Bullet.js';
import { Effect } from '../objects/Effect.js';

export class Exec {
    constructor(scene) {
        this.scene = scene;
    }

    // ■ 自機の移動
    player(my_input){
        let dx = 0;
        let dy = 0;
        if (my_input.up){dy = -1;}
        if (my_input.down){dy = 1;}
        if (my_input.left){dx = -1;}
        if (my_input.right){dx = 1;}
        GameState.player.move(dx,dy);
        // プレイヤーの弾の発射
        GameState.player.shoot(GameState.player_bullets, my_input.fire_a, my_input.fire_b);
        // プレイヤーの更新
        GameState.player.update();
    }

    // ■ 自弾の移動・衝突判定
    player_bullet(){
        for (let i = GameState.player_bullets.length - 1; i >= 0; i--) {
            const pb = GameState.player_bullets[i];
            pb.update();
            if (!pb.isAlive()) {
                pb.destroy();
                GameState.player_bullets.splice(i, 1);
                continue;
            }
            // 自弾とNPCとの衝突判定
            for (let j = GameState.npcs.length - 1; j >= 0; j --){
                const npc = GameState.npcs[j];
                if (MyMath.check_collision(pb.pos, pb.size / 2, npc.pos, npc.size / 2)){
                    // 自機・攻撃弾と通常敵
                    if (pb.type == GLOBALS.BULLET.TYPE.PLAYER_A &&
                        (npc.type == GLOBALS.NPC.TYPE.ENEMY ||
                         npc.type == GLOBALS.NPC.TYPE.OLD ||
                         npc.type == GLOBALS.NPC.TYPE.DISASTER)){
                        // 爆発エフェクト
                        const eff = new Effect(this.scene);
                        eff.setType(GLOBALS.EFFECT.TYPE.EXPLOSION, npc.pos);
                        GameState.effects.push(eff);
                        // [TODO] 点数加算 +100
                        // [TODO] 効果音（爆発）
                        pb.destroy();
                        GameState.player_bullets.splice(i, 1);
                        npc.destroy();
                        GameState.npcs.splice(j,1);
                        break;
                    // 自機・攻撃弾とボス敵（耐久力あり）
                    } else if (pb.type == GLOBALS.BULLET.TYPE.PLAYER_A &&
                        (npc.type == GLOBALS.NPC.TYPE.BOSS)){
                        pb.destroy();
                        GameState.player_bullets.splice(i,1);
                        if (npc.hit() <= 0){
                            npc.destroy();
                            GameState.npcs.splice(j,1);
                            // [TODO] 爆発エフェクト
                            // [TODO] 点数加算 +2000
                            // [TODO] 効果音（爆発）
                        } else {
                            // [TODO] 点数加算 +10
                            // [TODO] 効果音（打ち込み）
                        }
                        break;
                    // 自機・愛弾
                    } else if (pb.type == GLOBALS.BULLET.TYPE.PLAYER_L &&
                        (npc.type == GLOBALS.NPC.TYPE.FRIEND)){
                        pb.destroy();
                        GameState.player_bullets.splice(i,1);
                        npc.hit();
                        GameState.ending.add_friend();
                        // [TODO] 点数加算 +80
                        // [TODO] 効果音（友に愛を当てる）
                        // 友・励弾の発射
                        const blt = new Bullet(this.scene);
                        let bltpos = npc.pos.clone();
                        bltpos.y -= npc.size / 2;
                        blt.setType(GLOBALS.BULLET.TYPE.FRIEND, bltpos);
                        GameState.npc_bullets.push(blt);
                    }
                }
            }
        }
    }

    // ■ NPCの移動・（衝突判定）
    npc(){
        for (let i = GameState.npcs.length - 1; i >= 0; i--) {
            const npc = GameState.npcs[i];
            npc.update();
            if (!npc.isAlive()) {
                npc.destroy();
                GameState.npcs.splice(i, 1);
                continue;
            }
        }
    }

    // ■ NPC弾の移動・衝突判定
    npc_bullet(){
        for (let i = GameState.npc_bullets.length - 1; i >= 0; i--) {
            const npcblt = GameState.npc_bullets[i];
            npcblt.update();
            if (!npcblt.isAlive()) {
                npcblt.destroy();
                GameState.npc_bullets.splice(i,1);
                continue;
            }
            const p = GameState.player;
            if (MyMath.check_collision(p.pos, p.size / 2, npcblt.pos, npcblt.size / 2)){
                if (npcblt.type == GLOBALS.BULLET.TYPE.ENEMY){
                    // [TODO] 効果音（FAILED）
                    if (!GameState.debug){
                        // [TODO] BGMの停止
                        // [TODO] 当たった弾の保存（ここでは消さない）
                        // [TODO] game_over_count = 0
                        // [TODO] game_state = ST_FAILED（どう親シーンに渡そうか？）
                    }
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.FRIEND){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    // [TODO] エネルギー増加 +6
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.PARENT){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    // [TODO] エネルギー増加 +1
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.ILL){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    // [TODO] エネルギー減少 -10
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.VIRTUE){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    // [TODO] 得点 +300
                    // [TODO] エネルギー増加 +3
                    // [TODO] 効果音（徳）
                }
            }
        }
    }

    // ■ アイテムの移動・衝突判定
    item(){
        for (let i = GameState.items.length - 1; i >= 0; i--) {
            const item = GameState.items[i];
            item.update();
            if (!item.isAlive()) {
                item.destroy();
                GameState.items.splice(i,1);
                continue;
            }
            const p = GameState.player;
            if (MyMath.check_collision(p.pos, p.size / 2, item.pos, item.size / 2)){
                // console.log("item hit",i);
                // 妻との結婚
                if (item.type == GLOBALS.ITEM.TYPE.WIFE &&
                        GameState.married == false){
                    p.add_option(GLOBALS.ITEM.TYPE.WIFE, item.pos, 2);
                    GameState.married = true;
                    GameState.ending.set_partner(GLOBALS.ITEM.TYPE.WIFE);
                    for (let j = GameState.items.length - 1; j >= 0; j--) {
                        if (GameState.items[j].type == GLOBALS.ITEM.TYPE.HUSBAND){
                            GameState.items[j].exit();
                        }
                    }
                    item.destroy();
                    GameState.items.splice(i,1);
                    // [TODO] 効果音（結婚）
                // 夫との結婚
                } else if (item.type == GLOBALS.ITEM.TYPE.HUSBAND &&
                        GameState.married == false){
                    p.add_option(GLOBALS.ITEM.TYPE.HUSBAND, item.pos, 2);
                    GameState.married = true;
                    GameState.ending.set_partner(GLOBALS.ITEM.TYPE.HUSBAND);
                    for (let j = GameState.items.length - 1; j >= 0; j--) {
                        if (GameState.items[j].type == GLOBALS.ITEM.TYPE.WIFE){
                            GameState.items[j].exit();
                        }
                    }
                    item.destroy();
                    GameState.items.splice(i,1);
                    // [TODO] 効果音（結婚）
                // 子の取得
                } else if (item.type == GLOBALS.ITEM.TYPE.CHILD){
                    p.add_option(GLOBALS.ITEM.TYPE.CHILD, item.pos, p.options.length + 2);
                    GameState.ending.set_num_child(p.options.length - 1);
                    item.destroy();
                    GameState.items.splice(i,1);
                    // [TODO] 効果音
                // 「強」の取得
                } else if (item.type == GLOBALS.ITEM.TYPE.FORCE){
                    // [TODO] エネルギー増加 +100
                    // [TODO] 効果音
                    item.destroy();
                    GameState.items.splice(i,1);
                // 「毒」の取得
                } else if (item.type == GLOBALS.ITEM.TYPE.POISON){
                    // [TODO] エネルギー減少 -100
                    // [TODO] スコア加算 +10000
                    // [TODO] 効果音
                    item.destroy();
                    GameState.items.splice(i,1);
                }
            }
        }
    }

    // EFFECT（画面効果）の移動
    effect(){
        for (let i = GameState.effects.length - 1; i >= 0; i--) {
            const effect = GameState.effects[i];
            effect.update();
            if (!effect.isAlive()) {
                effect.destroy();
                GameState.effects.splice(i, 1);
                continue;
            }
        }
    }
}