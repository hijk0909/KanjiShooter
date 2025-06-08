// game_exec.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from '../objects/Bullet.js';
import { Effect } from '../objects/Effect.js';

export class Exec {
    constructor(scene) {
        this.scene = scene;
        this.failed = false;
    }

    // ■ 自機の移動
    player(my_input){
        // プレイヤーの移動
        GameState.player.move(my_input);
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
                         npc.type == GLOBALS.NPC.TYPE.DISASTER ||
                         npc.type == GLOBALS.NPC.TYPE.BARRIER)){
                        // 爆発エフェクト
                        const eff = new Effect(this.scene);
                        eff.setType(GLOBALS.EFFECT.TYPE.EXPLOSION, npc.pos);
                        GameState.effects.push(eff);

                        pb.destroy();
                        GameState.player_bullets.splice(i, 1);
                        npc.destroy();
                        GameState.npcs.splice(j,1);

                        GameState.score += 100;
                        GameState.sound.se_expl.play();
                        break;
                    // 自機・攻撃弾とボス敵（耐久力あり）
                    } else if (pb.type == GLOBALS.BULLET.TYPE.PLAYER_A &&
                        npc.type == GLOBALS.NPC.TYPE.BOSS &&
                        npc.state != GLOBALS.NPC.STATE.OUT){
                        pb.destroy();
                        GameState.player_bullets.splice(i,1);
                        if (npc.hit() <= 0){
                            npc.destroy();
                            GameState.npcs.splice(j,1);
                            // 爆発エフェクト
                            const eff = new Effect(this.scene);
                            eff.setType(GLOBALS.EFFECT.TYPE.EXPLOSION, npc.pos);
                            GameState.effects.push(eff);
                            GameState.score += 3000;
                            GameState.sound.se_expl2.play();
                        } else {
                            GameState.score += 10;
                            GameState.sound.se_hit.play();
                        }
                        break;
                    // 自機・攻撃弾と魔（ステータス判定あり）
                    } else if (pb.type == GLOBALS.BULLET.TYPE.PLAYER_A &&
                        npc.type == GLOBALS.NPC.TYPE.DEVIL &&
                        npc.state == GLOBALS.NPC.STATE.NORMAL){
                        pb.destroy();
                        GameState.player_bullets.splice(i, 1);
                        npc.destroy();
                        GameState.npcs.splice(j,1);
                        const eff = new Effect(this.scene);
                        eff.setType(GLOBALS.EFFECT.TYPE.EXPLOSION, npc.pos);
                        GameState.effects.push(eff);
                        GameState.score += 300;
                        GameState.sound.se_expl.play();
                        break;
                    // 自機・攻撃弾と壁（撃・愛とも吸収される）
                    } else if (((pb.type == GLOBALS.BULLET.TYPE.PLAYER_L) ||
                        (pb.type == GLOBALS.BULLET.TYPE.PLAYER_A)) &&
                        npc.type == GLOBALS.NPC.TYPE.WALL){
                        pb.destroy();
                        GameState.player_bullets.splice(i, 1);
                        GameState.score += 10;
                        GameState.sound.se_hit.play();
                        break;
                    // 自機・愛弾 - 友・父・母
                    } else if (pb.type == GLOBALS.BULLET.TYPE.PLAYER_L &&
                        (npc.type == GLOBALS.NPC.TYPE.FRIEND ||
                         npc.type == GLOBALS.NPC.TYPE.FATHER ||
                         npc.type == GLOBALS.NPC.TYPE.MOTHER )){
                        pb.destroy();
                        GameState.player_bullets.splice(i,1);
                        npc.hit();
                        GameState.sound.se_hit.play();
                        GameState.ending.add_friend();
                        GameState.score += 80;
                        // 友・励弾の発射
                        const blt = new Bullet(this.scene);
                        let bltpos = npc.pos.clone();
                        bltpos.y -= npc.size / 2;
                        blt.setType(GLOBALS.BULLET.TYPE.FRIEND, bltpos);
                        GameState.npc_bullets.push(blt);
                        break;
                    // 自機・愛弾 - 客
                    } else if (pb.type == GLOBALS.BULLET.TYPE.PLAYER_L &&
                        (npc.type == GLOBALS.NPC.TYPE.CUSTOMER)){
                        pb.destroy();
                        GameState.player_bullets.splice(i,1);
                        npc.hit();
                        GameState.sound.se_hit.play();
                        // 客・金弾の発射
                        const blt = new Bullet(this.scene);
                        let bltpos = npc.pos.clone();
                        bltpos.y -= npc.size / 2;
                        blt.setType(GLOBALS.BULLET.TYPE.MONEY, bltpos);
                        GameState.npc_bullets.push(blt);
                        break;
                    }
                }
            }
        }
    }

    // ■ NPCの移動・衝突判定
    npc(){
        for (let i = GameState.npcs.length - 1; i >= 0; i--) {
            const npc = GameState.npcs[i];
            npc.update();
            if (!npc.isAlive()) {
                npc.destroy();
                GameState.npcs.splice(i, 1);
                continue;
            }
            const p = GameState.player;
            if (npc.type == GLOBALS.NPC.TYPE.WALL){
                // 敵弾との当たり判定は甘め（自機を小さくする）
                if (MyMath.check_collision(p.pos, p.size / 6, npc.pos, npc.size / 2)){
                    this.fail();
                }
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
            if (npcblt.type == GLOBALS.BULLET.TYPE.ENEMY){
                // 敵弾との当たり判定は甘め（自機を小さくする）
                if (MyMath.check_collision(p.pos, p.size / 6, npcblt.pos, npcblt.size / 2)){
                    this.fail();
                }
            } else if (MyMath.check_collision(p.pos, p.size / 3, npcblt.pos, npcblt.size / 2)){
                if (npcblt.type == GLOBALS.BULLET.TYPE.FRIEND){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    GameState.player.add_energy(6);
                    GameState.sound.se_earn.play();
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.PARENT){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    GameState.player.add_energy(1);
                    GameState.sound.se_earn.play();
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.ILL){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    GameState.player.add_energy(-10);
                    GameState.sound.se_loss.play();
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.VIRTUE){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    GameState.score += 300;
                    GameState.player.add_energy(3);
                    GameState.sound.se_earn.play();
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.CONFU){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    GameState.player.confuse();
                    GameState.sound.se_loss.play();
                } else if (npcblt.type == GLOBALS.BULLET.TYPE.MONEY){
                    npcblt.destroy();
                    GameState.npc_bullets.splice(i,1);
                    GameState.score += 50;
                    GameState.sound.se_earn.play();
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
                    GameState.sound.se_bell.play();
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
                    GameState.sound.se_bell.play();
                // 子の取得
                } else if (item.type == GLOBALS.ITEM.TYPE.CHILD){
                    p.add_option(GLOBALS.ITEM.TYPE.CHILD, item.pos, p.options.length + 2);
                    GameState.ending.set_num_child(p.options.length - 1);
                    item.destroy();
                    GameState.items.splice(i,1);
                    GameState.sound.se_earn.play();
                // 「強」の取得
                } else if (item.type == GLOBALS.ITEM.TYPE.FORCE){
                    GameState.player.add_energy(100);
                    item.destroy();
                    GameState.items.splice(i,1);
                    GameState.sound.se_earn.play();
                // 「毒」の取得
                } else if (item.type == GLOBALS.ITEM.TYPE.POISON){
                    GameState.player.add_energy(-100);
                    GameState.score += 10000;
                    item.destroy();
                    GameState.items.splice(i,1);
                    GameState.sound.se_loss.play();
                }
            }
        }
    }

    // FAIL
    fail(){
        // [TODO] 効果音（FAILED）
        if (!GameState.debug){
            GameState.sound.bgm_main.stop();
            // [TODO] 当たった弾の保存（ここでは消さない）
            // [TODO] game_over_count = 0
            // [TODO] game_state = ST_FAILED（どう親シーンに渡そうか？）
            GameState.sound.jingle_gameover.play();
            this.failed = true;
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