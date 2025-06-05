// KanjiShooter/AssetLoader.js
export class AssetLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'AssetLoaderScene' });
    }

    preload(){
        // ローディングバーの簡易表示
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 25, width / 2, 50);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 15, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });

        // 画像
        // 自機
        this.load.image('p', 'assets/images/img_p.png');
        // オプション
        this.load.image('oh', 'assets/images/img_oh.png');
        this.load.image('ow', 'assets/images/img_ow.png');
        this.load.image('oc', 'assets/images/img_oc.png');
        // NPC
        this.load.image('ce', 'assets/images/img_ce.png');
        this.load.image('cf', 'assets/images/img_cf.png');
        this.load.image('cfa', 'assets/images/img_cfa.png');
        this.load.image('cma', 'assets/images/img_cma.png');
        this.load.image('cbarrier', 'assets/images/img_cbarrier.png');
        this.load.image('cboss', 'assets/images/img_cboss.png');
        this.load.image('cdevil', 'assets/images/img_cdevil.png');
        this.load.image('cdisaster', 'assets/images/img_cdisaster.png');
        this.load.image('cold', 'assets/images/img_cold.png');
        this.load.image('cwall', 'assets/images/img_cwall.png');
        // 弾
        this.load.image('be', 'assets/images/img_be.png');
        this.load.image('bf', 'assets/images/img_bf.png');
        this.load.image('bpl', 'assets/images/img_bpl.png');
        this.load.image('bpa', 'assets/images/img_bpa.png');
        this.load.image('bconfu', 'assets/images/img_bconfu.png');
        this.load.image('bpar', 'assets/images/img_bpar.png');
        this.load.image('bvirtue', 'assets/images/img_bvirtue.png');
        this.load.image('bill', 'assets/images/img_bill.png');
        // エフェクト
        this.load.image('ex', 'assets/images/img_ex.png');
        // アイテム
        this.load.image('ic', 'assets/images/img_ic.png');
        this.load.image('ih', 'assets/images/img_ih.png');
        this.load.image('iw', 'assets/images/img_iw.png');
        this.load.image('if', 'assets/images/img_if.png');
        this.load.image('ip', 'assets/images/img_ip.png');
        // 臨終
        this.load.image('nh', 'assets/images/img_nh.png');
        this.load.image('nw', 'assets/images/img_nw.png');
        this.load.image('nc', 'assets/images/img_nc.png');
        this.load.image('ngc', 'assets/images/img_ngc.png');  
        this.load.image('nfa', 'assets/images/img_nfa.png');
        this.load.image('nma', 'assets/images/img_nma.png');
        this.load.image('nf', 'assets/images/img_nf.png');
        // 歳
        this.load.image('y0', 'assets/images/y0.png');
        this.load.image('y10', 'assets/images/y10.png');
        this.load.image('y20', 'assets/images/y20.png');
        this.load.image('y30', 'assets/images/y30.png');
        this.load.image('y40', 'assets/images/y40.png');
        this.load.image('y50', 'assets/images/y50.png');
        this.load.image('y60', 'assets/images/y60.png');
        this.load.image('y70', 'assets/images/y70.png');
        this.load.image('y80', 'assets/images/y80.png');
        this.load.image('y90', 'assets/images/y90.png');
        this.load.image('y100', 'assets/images/y100.png');
        // UIボタン
        this.load.image('btn_tap', 'assets/images/btn_tap.png');
        // 操作説明
        this.load.image('op_key', 'assets/images/op_key.png');
        this.load.image('op_gamepad', 'assets/images/op_gamepad.png');
        this.load.image('op_touch', 'assets/images/op_touch.png');
        // アイコン
        this.load.image('icon_finger', 'assets/images/icon_finger.png');

        // 効果音
        this.load.audio('se_expl', './assets/audio/se/se_expl.mp3');
        this.load.audio('se_expl2', './assets/audio/se/se_expl2.mp3');
        this.load.audio('se_shot_attack', './assets/audio/se/se_shot_attack.mp3');
        this.load.audio('se_shot_love', './assets/audio/se/se_shot_love.mp3');
        this.load.audio('se_energyup', './assets/audio/se/se_energyup.mp3');
        this.load.audio('se_bell', './assets/audio/se/se_bell.mp3');
        // ジングル
        this.load.audio('jingle_gameover', './assets/audio/se/jingle_gameover.mp3');
    }

    create() {
        // 次のシーン（タイトル画面）へ遷移
        this.scene.start('TitleScene');
    }
}