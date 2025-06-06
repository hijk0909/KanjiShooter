import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';
import { MyMath } from '../utils/MathUtils.js';
import { BG } from '../objects/BG.js';
import { Bullet } from '../objects/Bullet.js';
import { Effect } from '../objects/Effect.js';
import { Ending } from '../objects/Ending.js';
import { Item } from '../objects/Item.js';
import { NPC } from '../objects/NPC.js';
import { Option } from '../objects/Option.js';
import { Player } from '../objects/Player.js';
import { Exec } from './game_exec.js';
import { Spawn } from './game_spawn.js';

const ST_PLAYING = 0;
const ST_FAILED = 1;

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.camera = null;
    }

    create() {
        
        // ゲームのセットアップ
        this.scene.launch('UIScene');
        this.ui = this.scene.get('UIScene');
        this.game_state = ST_PLAYING;
        this.game_over_count = 0;

        this.my_input = new MyInput(this);
        this.exec = new Exec(this);
        this.spawn = new Spawn(this);
        this.drawPadArea();
        this.graphics = this.add.graphics();

        GameState.player = new Player(this);
        GameState.pos = GLOBALS.POS.MAX;
        // 臨終のデバッグ用スタート地点
        // GameState.pos = GLOBALS.POS.GOAL + 10;
        GameState.married = false;
        GameState.ending = new Ending(this);
        GameState.score = 0;
        GameState.npcs = [];
        GameState.player_bullets = [];
        GameState.npc_bullets = [];
        GameState.items = [];
        GameState.effects = [];

        GameState.player.setPos(new Phaser.Math.Vector2(GLOBALS.G_WIDTH / 2, GLOBALS.G_HEIGHT - 100));
        GameState.camera = {
            position: new Phaser.Math.Vector3(GLOBALS.G_WIDTH / 2, GLOBALS.G_HEIGHT, -450),
            rotation: { upDown: -32, rightLeft: 0, roll: 0 }
        };

        this.bg = new BG(this);

        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        // [DEBUG] 最初からオプション取得状態にする
        // GameState.player.add_option(GLOBALS.ITEM.TYPE.WIFE, new Phaser.Math.Vector2(10,20), 2);
        // GameState.player.add_option(GLOBALS.ITEM.TYPE.CHILD, new Phaser.Math.Vector2(100,30), 3);
        // GameState.player.add_option(GLOBALS.ITEM.TYPE.CHILD, new Phaser.Math.Vector2(200,50), 4);
        // GameState.player.add_option(GLOBALS.ITEM.TYPE.CHILD, new Phaser.Math.Vector2(300,80), 5);
    } // End of create()

    update(time, delta) {
        this.graphics.clear();
        GameState.ff = delta * GLOBALS.G_FPS / 1000;
        // console.log("GameState.delta", GameState.delta);

        if (this.game_state === ST_PLAYING){
            // スクロール
            GameState.pos -= 1 * GameState.ff;
            if ( GameState.pos <= 0){
                this.scene.stop('UIScene');
                this.scene.start('GameClearScene');
            }

            // 背景の更新
            this.bg.update(Math.floor(GameState.pos));
            // 臨終の更新
            GameState.ending.update(Math.floor(GameState.pos));

            // NPCの生成（座標）
            this.spawn.npc_pos(Math.floor(GameState.pos));
            // NPCの生成（エリア）
            this.spawn.npc_area(Math.floor(GameState.pos));
            // アイテムの生成（座標）
            this.spawn.item_pos(Math.floor(GameState.pos));

            // 入力状態の更新
            this.my_input.update();
            this.my_input.draw(this.graphics);

            // プレイヤーの実行
            this.exec.player(this.my_input);
            // プレイヤー弾の実行
            this.exec.player_bullet();
            // NPCの実行
            this.exec.npc();
            // NPC弾の実行
            this.exec.npc_bullet();
            // アイテムの実行
            this.exec.item();
            // 画面効果の実行
            this.exec.effect();

            if (this.exec.failed){
                this.game_state = ST_FAILED;
                this.game_over_count = 0;
            }

        } else if (this.game_state === ST_FAILED){
            this.game_over_count += 1 * GameState.ff;
            if (this.game_over_count > 120){
                this.scene.stop('UIScene');
                this.scene.start('GameOverScene');
            }
        }

        // 隠しキーボード操作
        if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
            this.scene.stop('UIScene');
            this.scene.start('TitleScene');
        }

    } // End of update()

    drawPadArea(){
        if (this.scale.height > 600) {
            const hiddenPadHeight = this.scale.height - 600;

            this.add.rectangle(
                this.scale.width / 2,
                600 + hiddenPadHeight / 2,
                this.scale.width,
                hiddenPadHeight,
                0x303030
            ).setDepth(997);


            this.add.image(this.scale.width/2,600+hiddenPadHeight/2,'icon_finger')
            .setDepth(998)
            .setOrigin(0.5,0.5)
            .setScale(0.2);
        }
    }

} // End of GameScene