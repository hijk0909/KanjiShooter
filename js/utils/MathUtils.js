// MathUtils.js
import { GLOBALS } from '../GameConst.js';

export class MyMath {

    static radians(degrees){
        return degrees * (Math.PI / 180);
    }

    static copysign(x,y){
        return Math.abs(x) * Math.sign(y);
    }

    static check_collision(p1,size1, p2, size2) {
        const distance = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
        return distance < (size1 + size2)
    }

    static rotate_towards_target(src, target, dx, dy, max_angle_deg){
        const target_angle = Math.atan2(target.y - src.y, target.x - src.x);
        const current_angle = Math.atan2(dy, dx);
        let angle_diff = (target_angle - current_angle + Math.PI) % (2 * Math.PI) - Math.PI;
        const max_rotation = this.radians(max_angle_deg);
        if (Math.abs(angle_diff) > max_rotation){
            angle_diff = this.copysign(max_rotation, angle_diff);
        }
        const new_angle = current_angle + angle_diff;
        const new_dx = Math.cos(new_angle);
        const new_dy = Math.sin(new_angle);
        return {dx : new_dx, dy : new_dy};
    }

    static target_angle(src, target, angle_diff){
        const target_angle = Math.atan2(target.y - src.y, target.x - src.x);
        return (target_angle + angle_diff + Math.PI) % ( 2 * Math.PI) - Math.PI;
    }

    static projectPoint(point3D, camera) {
        const { x: x1, y: y1, z: z1 } = point3D;
        const { position, rotation } = camera;
        const { x: xc, y: yc, z: zc } = position;
        const { upDown, rightLeft, roll } = rotation;

        let dx = x1 - xc;
        let dy = y1 - yc;
        let dz = z1 - zc;

        // 回転（左右：Y軸）
        const radRL = Phaser.Math.DegToRad(rightLeft);
        const cosRL = Math.cos(radRL);
        const sinRL = Math.sin(radRL);
        let dx1 = cosRL * dx - sinRL * dz;
        let dz1 = sinRL * dx + cosRL * dz;

        // 回転（上下：X軸）
        const radUD = Phaser.Math.DegToRad(upDown);
        const cosUD = Math.cos(radUD);
        const sinUD = Math.sin(radUD);
        let dy1 = cosUD * dy - sinUD * dz1;
        dz1 = sinUD * dy + cosUD * dz1;

        // 回転（Z軸：ロール）
        const radZ = Phaser.Math.DegToRad(roll);
        const cosZ = Math.cos(radZ);
        const sinZ = Math.sin(radZ);
        let dx2 = cosZ * dx1 - sinZ * dy1;
        let dy2 = sinZ * dx1 + cosZ * dy1;

        if (dz1 <= 0) {
            return null;  // 画面裏側
        }

        const fov = 500;
        const x2 = GLOBALS.G_WINDOW_WIDTH / 2 + (dx2 / dz1) * fov;
        const y2 = GLOBALS.G_WINDOW_HEIGHT / 2 + (dy2 / dz1) * fov;
        const depth = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz1 * dz1);
        const ratio = fov / dz1;

        return {
            screenPosition: new Phaser.Math.Vector2(x2, y2),
            depth: depth,
            ratio: ratio
        };
    }

    static age(pos){
        let age = 0;
        // 年齢基準：スクリーン中央
        let spos = pos + GLOBALS.G_HEIGHT / 2;
        if (spos < GLOBALS.POS.GOAL){
            age = 100;
        } else {
            age = Math.max(0, 100 - 10 * (spos - GLOBALS.POS.GOAL) / GLOBALS.POS.UNIT);
        }
        return Math.floor(age);
    }
}