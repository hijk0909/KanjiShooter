// Starting.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Effect } from '../objects/Effect.js';

export class Starting {
    constructor(scene){
        this.scene = scene;
        this.count = 0;
        this.max_count = 360;
        this.isStarting = true;
    }

    setup(){
        // プレイヤー「祝」エフェクトの追加
        const eff = new Effect(this.scene);
        eff.setType(GLOBALS.EFFECT.TYPE.BLESSING, GameState.player.pos);        
        GameState.effects.push(eff);

        // ワイプ・イン
        this.overlay = this.scene.add.rectangle(0, 0, GLOBALS.G_WINDOW_WIDTH, GLOBALS.G_WINDOW_HEIGHT, 0x000000, 1)
            .setOrigin(0)
            .setDepth(900);
        let revealMaskGraphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        let mask = revealMaskGraphics.createGeometryMask();
        mask.invertAlpha = true;
        this.overlay.setMask(mask);
        let maskData = { radius: 1 };
        this.scene.tweens.add({
            targets: maskData,
            radius: 500,
            duration: 3000,
            ease: 'Sine.easeOut',
            onUpdate: () => {
                revealMaskGraphics.clear();
                revealMaskGraphics.fillStyle(0xffffff);
                revealMaskGraphics.beginPath();
                revealMaskGraphics.arc(GLOBALS.G_WINDOW_WIDTH / 2, GLOBALS.G_WINDOW_HEIGHT / 2, maskData.radius, 0, Math.PI * 2);
                revealMaskGraphics.fillPath();
            },
            onComplete: () => {
                this.overlay.destroy();  // 演出後はマスクと覆いを削除
            }
        });

        // 変数
        this.count = 0;
        this.isStarting = true;
    }

    update(){
        if (this.isStarting){
            GameState.camera.position = new Phaser.Math.Vector3(GLOBALS.CAMERA.X, GLOBALS.CAMERA.Y, -5 + GLOBALS.CAMERA.Z * this.count / this.max_count);
            GameState.camera.rotation.roll = GLOBALS.CAMERA.ROLL + ((this.max_count - this.count) / this.max_count) * 10;

            // 時エフェクトの追加
            if ( this.count < 200){
                const eff = new Effect(this.scene);
                eff.setType(GLOBALS.EFFECT.TYPE.TIME, GameState.player.pos);
                eff.set_speed(6);
                GameState.effects.push(eff);
            }

            this.count += 1 * GameState.ff;
            if (this.count >= this.max_count){
                // カメラのリセット
                GameState.camera = {
                    position: new Phaser.Math.Vector3(GLOBALS.CAMERA.X, GLOBALS.CAMERA.Y, GLOBALS.CAMERA.Z),
                    rotation: { upDown: GLOBALS.CAMERA.UPDOWN, rightLeft: GLOBALS.CAMERA.RIGHTLEFT, roll: GLOBALS.CAMERA.ROLL }
                };
                this.isStarting = false;
            }
        }
    }
}