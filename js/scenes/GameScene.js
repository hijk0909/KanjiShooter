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

const ST_PLAYING = 0;
const ST_FAILED = 0;

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

        this.my_input = new MyInput(this);
        this.graphics = this.add.graphics();

        GameState.player = new Player(this);
        GameState.pos = GLOBALS.POS.MAX;
        GameState.married = false;
        GameState.ending = new Ending();
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

        GameState.player.add_option(GLOBALS.ITEM.TYPE.WIFE, new Phaser.Math.Vector2(10,10), 2);
        GameState.player.add_option(GLOBALS.ITEM.TYPE.CHILD, new Phaser.Math.Vector2(200,50), 3);
        GameState.player.add_option(GLOBALS.ITEM.TYPE.CHILD, new Phaser.Math.Vector2(300,200), 4);
        GameState.player.add_option(GLOBALS.ITEM.TYPE.CHILD, new Phaser.Math.Vector2(600,400), 5);
    } // End of create()

    update(time, delta) {
        this.graphics.clear();

        if (this.game_state === ST_PLAYING){
            GameState.pos -= 1;
            this.bg.update(GameState.pos);

            // 入力状態の更新
            this.my_input.update();
            this.my_input.draw(this.graphics);
            // プレイヤーの移動
            let dx = 0;
            let dy = 0;
            if (this.my_input.up){dy = -1;}
            if (this.my_input.down){dy = 1;}
            if (this.my_input.left){dx = -1;}
            if (this.my_input.right){dx = 1;}
            GameState.player.move(dx,dy);
            // プレイヤーの弾の発射
            GameState.player.shoot(this.my_input.fire, GameState.player_bullets);
            // プレイヤーの更新
            GameState.player.update();

            // プレイヤー弾
            for (let i = GameState.player_bullets.length - 1; i >= 0; i--) {
                const pb = GameState.player_bullets[i];
                pb.update();
                if (!pb.isAlive()) {
                    pb.destroy();
                    GameState.player_bullets.splice(i, 1);
                }
            }
        } else if (this.game_state === ST_FAILED){

        }

        // 隠しキーボード操作
        if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
            this.scene.start('TitleScene');
        }

    } // End of update()

} // End of GameScene