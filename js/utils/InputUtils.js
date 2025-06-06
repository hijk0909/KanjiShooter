// InputUtils.js
import { GameState } from '../GameState.js';

const DOUBLE_TAP_TIME_THRESHOLD = 10;

export class MyInput {
    constructor(scene) {
        this.scene = scene;
        this.up = this.up1 = this.up2 = this.up3 = false;
        this.down = this.down1 = this.down2 = this.down3 = false;
        this.left = this.left1 = this.left2 = this.left3 = false;
        this.right = this.right1 = this.right2 = this.right3 = false;
        this.fire_a = this.fire_a1 = this.fire_a2 = this.fire_a4 = false;
        this.fire_b = this.fire_b1 = this.fire_b2 = this.fire_b4 = false;
        this.dx = 0;
        this.dy = 0;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.pointerDown = false;
        this.current_pointer = null;
        this.last_pointer = null;
        this.callback_pad = null;
        this.callback_next = null;
        this.pad = null;

        // キーボード：キー登録
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyX = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        // ゲームパッド接続確認
        if (this.scene.input.gamepad.total > 0) {
            this.pad = this.scene.input.gamepad.getPad(0);
        } else {
            this.scene.input.gamepad.once('connected', (pad) => {
            this.pad = pad;
            // console.log("connected");
            });
        }

        // マウス＆タッチ操作
        scene.input.on('pointerdown', this.onPointerDown, this);
        scene.input.on('pointermove', this.onPointerMove, this);
        scene.input.on('pointerup', this.onPointerUp, this);

        this.release_counter = 0;
        this.toggle = 1;

        const canvas = scene.game.canvas;
        canvas.addEventListener("mouseleave", () => this.stopFire());
        canvas.addEventListener("touchcancel", () => this.stopFire());
    }

    update() {
        // キーボード
        this.up1 = this.cursors.up.isDown;
        this.down1 = this.cursors.down.isDown;
        this.left1 = this.cursors.left.isDown;
        this.right1 = this.cursors.right.isDown;
        this.fire_a1 = this.keyZ.isDown;
        this.fire_b1 = this.keyX.isDown;

        // パッド（アナログ入力）
        if (this.pad) {
            // アナログ入力
            let axes = this.pad.axes;
            if (axes.length >= 2) {
                // console.log("x,y:",axes[0].getValue(), axes[1].getValue() );
                const x = axes[0].getValue();
                const y = axes[1].getValue();
                this.left2 = x < -0.5;
                this.right2 = x > 0.5;
                this.up2 = y < -0.5;
                this.down2 = y > 0.5;
            }
            // ボタン入力
            this.up3 = this.pad.buttons[12].pressed;
            this.down3 = this.pad.buttons[13].pressed;
            this.left3 = this.pad.buttons[14].pressed;
            this.right3 = this.pad.buttons[15].pressed;
            this.fire_a2 = this.pad.buttons[0].pressed;
            this.fire_b2 = this.pad.buttons[1].pressed;
        }

        // ポインタ入力（マウス、タッチパネル）
        if (this.pointerDown){
            // ポインタが押されている
            if (this.toggle === 0){
                this.fire_a4 = true;
            } else {
                this.fire_b4 = true;
            }
        } else {
            // ポインタが押されていない
            this.release_counter += 1;
        }

        if (this.pointerDown && this.current_pointer && this.last_pointer){
            this.dx = this.current_pointer.x - this.last_pointer.x;
            this.dy = this.current_pointer.y - this.last_pointer.y;
        } else {
            this.dx = this.dy = 0;
        }
        this.last_pointer = this.current_pointer;

        // 操作の結合
        this.up = this.up1 || this.up2 || this.up3;
        this.down = this.down1 || this.down2 || this.down3;
        this.left = this.left1 || this.left2 || this.left3;
        this.right = this.right1 || this.right2 || this.right3;
        this.fire_a = this.fire_a1 || this.fire_a2 || this.fire_a4;
        this.fire_b = this.fire_b1 || this.fire_b2 || this.fire_b4;
    }

    onPointerDown(pointer) {
        // console.log("onPointerDown", pointer.x, pointer.y);
        this.pointerDown = true;
        this.fire_t = true; // 発射開始

        if (this.release_counter < DOUBLE_TAP_TIME_THRESHOLD){
            this.toggle = this.toggle === 1 ? 0 : 1;
        }

        this.current_pointer = { x: pointer.x, y: pointer.y };
    }

    onPointerMove(pointer) {
        if (this.pointerDown){
            this.current_pointer = { x: pointer.x, y: pointer.y};
        }
    }

    onPointerUp(pointer) {
        this.pointerDown = false;
        this.release_counter = 0;
        this.current_pointer = null;
        this.stopFire();
    }

    draw(graphics){
        if (this.pointerDown && this.current_pointer){
            if ( this.toggle == 0){
                graphics.fillStyle(0xff0000, 0.5);
            } else {
                graphics.fillStyle(0x00ffff, 0.5);
            }
            graphics.fillCircle(this.current_pointer.x, this.current_pointer.y, 10).setDepth(999);
        }
    }

    stopFire() {
        this.fire_a4 = this.fire_b4 = false;
    }

    registerPadConnect(callback) {
        this.callback_pad = callback;
        this.scene.input.gamepad.once('connected', (pad) => {
            this.pad = pad;
            callback();
        });
    }

    registerNextAction(callback) {
        this.scene.input.keyboard.on('keydown-SPACE', callback);
        this.scene.input.gamepad.on('down', (pad, button) => {
            this.pad = pad;
            if (button.index === 9) callback(); // STARTボタン
        });
    }
}