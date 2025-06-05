// InputUtils.js
import { GameState } from '../GameState.js';

const SWIPE_THRESHOLD = 50;
const DOUBLE_TIME_THRESHOLD = 10;

export class MyInput {
    constructor(scene) {
        this.scene = scene;
        this.up = this.up1 = this.up2 = this.up3 = this.up4 = false;
        this.down = this.down1 = this.down2 = this.down3 = this.down4 = false;
        this.left = this.left1 = this.left2 = this.left3 = this.left4 = false;
        this.right = this.right1 = this.right2 = this.right3 = this.right4 = false;
        this.fire_a = this.fire_a1 = this.fire_a2 = this.fire_a4 = false;
        this.fire_b = this.fire_b1 = this.fire_b2 = this.fire_b4 = false;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.pointerDown = false;
        this.swipeStart = null;
        this.callback_pad = null;
        this.callback_next = null;
        this.pad = null;

        // キーボード関連
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyX = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

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

        this.release_counter = 0;
        this.toggle = 0;

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

        if (this.pointerDown){
            if (this.toggle === 0){
                this.fire_a4 = true;
            } else {
                this.fire_b4 = true;
            }
        } else {
            this.release_counter += 1;
        }

        this.up = this.up1 || this.up2 || this.up3 || this.up4;
        this.down = this.down1 || this.down2 || this.down3 || this.down4;
        this.left = this.left1 || this.left2 || this.left3 || this.left4;
        this.right = this.right1 || this.right2 || this.right3 || this.right4;
        this.fire_a = this.fire_a1 || this.fire_a2 || this.fire_a4;
        this.fire_b = this.fire_b1 || this.fire_b2 || this.fire_b4;
    }

    onPointerDown(pointer) {
        // console.log("onPointerDown", pointer.x, pointer.y);
        this.pointerDown = true;
        this.fire_t = true; // 発射開始

        if (this.swipeStart){
            if (this.release_counter < DOUBLE_TIME_THRESHOLD){
                this.toggle = this.toggle === 1 ? 0 : 1;
            }
        }

        this.swipeStart = { x: pointer.x, y: pointer.y };
    }

    onPointerMove(pointer) {
        if (!this.pointerDown || !this.swipeStart) return;
        const dx = pointer.x - this.swipeStart.x;
        const dy = pointer.y - this.swipeStart.y;
        if (Math.sqrt(dx*dx+dy*dy) < SWIPE_THRESHOLD){
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
        this.release_counter = 0;
        this.resetDirection();
    }

    draw(graphics){
        if (this.pointerDown){
            graphics.fillStyle(0xffffff, 0.5);
            graphics.fillCircle(this.swipeStart.x, this.swipeStart.y, 10).setDepth(999);
        }
    }

    resetDirection() {
        this.up4 = this.down4 = this.left4 = this.right4 = false;
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