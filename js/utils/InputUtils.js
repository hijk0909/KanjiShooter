// InputUtils.js
import { GameState } from '../GameState.js';

export class MyInput {
    constructor(scene) {
        this.scene = scene;
        this.up = this.down = this.left = this.right = false;
        this.up1 = this.donw1 = this.left1 = this.right1 = false;
        this.up2 = this.donw2 = this.left2 = this.right2 = false;
        this.up3 = this.donw3 = this.left3 = this.right3 = false;
        this.up4 = this.donw4 = this.left4 = this.right4 = false;
        this.fire = false;
        this.fire1 = this.fire3 = this.fire4 = false;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.pointerDown = false;
        this.swipeStart = null;
        this.callback_pad = null;
        this.callback_next = null;
        this.pad = null;

        // キーボード関連
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // ゲームパッド関連
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

        const canvas = scene.game.canvas;
        canvas.addEventListener("mouseleave", () => this.resetDirection());
        canvas.addEventListener("touchcancel", () => this.resetDirection());
    }

    update() {
        // キーボード
        this.up1 = this.cursors.up.isDown;
        this.down1 = this.cursors.down.isDown;
        this.left1 = this.cursors.left.isDown;
        this.right1 = this.cursors.right.isDown;
        this.fire1 = this.keyZ.isDown;

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
            this.fire3 = this.pad.buttons[0].pressed;
        }

        this.up = this.up1 || this.up2 || this.up3 || this.up4;
        this.down = this.down1 || this.down2 || this.down3 || this.down4;
        this.left = this.left1 || this.left2 || this.left3 || this.left4;
        this.right = this.right1 || this.right2 || this.right3 || this.right4;
        this.fire = this.fire1 || this.fire3 || this.fire4;
    }

    onPointerDown(pointer) {
        // console.log("onPointerDown", pointer.x, pointer.y);
        this.pointerDown = true;
        this.fire4 = true; // 発射開始
        this.swipeStart = { x: pointer.x, y: pointer.y };
    }

    onPointerMove(pointer) {
        if (!this.pointerDown || !this.swipeStart) return;
        const dx = pointer.x - this.swipeStart.x;
        const dy = pointer.y - this.swipeStart.y;
        if (dx*dx+dy*dy < 200){
            this.up4 = this.down4 = this.left4 = this.right4 = false;
        } else {
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            const diff = 75;
            this.up4 = (angle > -90 - diff && angle < -90 + diff);
            this.down4 = (angle > 90 - diff  && angle < 90 + diff);
            this.left4 = (angle > 180 - diff || angle < -180 + diff);
            this.right4 = (angle > -diff && angle < diff);
        }
    }

    onPointerUp(pointer) {
        this.pointerDown = false;
        this.fire4 = false;
        this.resetDirection();
    }

    draw(graphics){
        if (this.pointerDown){
            graphics.fillStyle(0xffffff, 0.5);
            graphics.fillCircle(this.swipeStart.x, this.swipeStart.y, 10);
        }
    }

    resetDirection() {
        this.up4 = this.down4 = this.left4 = this.right4 = false;
        this.fire = false;
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