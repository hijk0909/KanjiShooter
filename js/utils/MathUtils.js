// MathUtils.js
import { GLOBALS } from '../GameConst.js';

export class MyMath {

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
}