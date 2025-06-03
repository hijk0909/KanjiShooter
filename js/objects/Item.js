// Item.js
import { GameState } from '../GameState.js';

const ORIGINAL_SIZE = 64;

export class Item {
    constructor(scene){
        this.scene = scene;
        this.type = null;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.collision = new Phaser.Geom.Rectangle(-20, -20, 40, 40);  // 中心からの相対矩形
        this.alive = true;
    }

    setType(type, pos){
        this.type = type;
        this.pos = pos.clone(); // Phaser.Math.Vector2
        this.alive = true;
    }

    update(g) {

    }

    draw(graphics) {

    }

    isAlive() {
        return this.alive;
    }
}