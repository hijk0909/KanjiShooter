// DrawUtils.js
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';

export class MyDraw {

    static updateSprite( sprite, pos, size, depth2 = null){
        // 3D → 2D変換
        const point = new Phaser.Math.Vector3(pos.x, pos.y, 0);
        const result = MyMath.projectPoint(point,GameState.camera);
        if (result){
            const { screenPosition, depth, ratio } = result;
            // console.log(screenPosition.x, screenPosition.y, depth, ratio);
            sprite.visible = true;
            sprite.setPosition(screenPosition.x, screenPosition.y);
            sprite.setScale(size * ratio);
            if (depth2){
                sprite.setDepth(depth2);
            } else {
                sprite.setDepth(Math.max(-900,-depth));
            }
        } else {
            sprite.visible = false;
        }
    }

    static updateSprite3( sprite, point, size ){
        const result = MyMath.projectPoint(point,GameState.camera);
        if (result){
            const { screenPosition, depth, ratio } = result;
            // console.log(screenPosition.x, screenPosition.y, depth, ratio);
            sprite.visible = true;
            sprite.setPosition(screenPosition.x, screenPosition.y);
            sprite.setScale(size * ratio);
            sprite.setDepth(Math.max(-900,-depth));
        } else {
            sprite.visible = false;
        }
    } 

    static drawLine( g, x1, y1, x2, y2 ){
        const p1 = new Phaser.Math.Vector3(x1,y1,0);
        const res1 = MyMath.projectPoint(p1,GameState.camera);
        const p2 = new Phaser.Math.Vector3(x2,y2,0);
        const res2 = MyMath.projectPoint(p2,GameState.camera);
        if (res1 && res2){
            const { screenPosition : sp1 } = res1;
            const { screenPosition : sp2 } = res2;
            g.beginPath();
            g.moveTo(sp1.x, sp1.y);
            g.lineTo(sp2.x, sp2.y);
            g.strokePath();
        }
    }

    static set_glow(scene, sprite, color){
        sprite.preFX.setPadding(32);
        const fx = sprite.preFX.addGlow(color);
        scene.tweens.add({
            targets: fx,
            outerStrength: 5,
            duration: 300,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });
    }

}