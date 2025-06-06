// GameConst.js
export const GLOBALS = {
    G_WIDTH : 600,
    G_HEIGHT : 800,
    G_WINDOW_WIDTH : 800,
    G_WINDOW_HEIGHT : 600,
    G_FPS : 60,

    COLOR: {
        BLACK : 0x000000,
        WHITE : 0xffffff,
        GRAY : 0x808080,
        RED: 0xff0000
    },

    POS: {
        MAX : 10010,
        UNIT : 960,
        GOAL : 400
    },

    OPTION: {
        STATE:{
            NONE : 0,
            FLOAT : 1,
            NORMAL : 2,
            OUT : 3
        },        
    },

    NPC: {
        TYPE: {
            ENEMY :  0,
            FRIEND : 1,
            FATHER : 2,
            MOTHER : 3,
            OLD : 4,
            BOSS : 5,
            DISASTER : 6,
            DEVIL : 7,
            WALL : 8,
            BARRIER : 9
        },
        STATE: {
            IN : 0,
            NORMAL : 1,
            OUT : 2
        },
    },

    BULLET: {
        TYPE: {
            PLAYER_A : 0,
            PLAYER_L : 1,
            ENEMY : 2,
            FRIEND : 3,
            PARENT : 4,
            ILL : 5,
            VIRTUE : 6,
            CONFU : 7
        },
    },

    ITEM: {
        TYPE: {
            WIFE : 0,
            HUSBAND : 1,
            CHILD : 2,
            FORCE : 3,
            POISON : 4
        },
        STATE: {
            NORMAL : 0,
            OUT : 1
        },
    },

    EFFECT: {
        TYPE: {
            EXPLOSION : 0
        },
    },

    SE: {
        TYPE: {
            SHOOT_ATTACK : 0,
            SHOOT_LOVE : 1,
            HIT_ATTACK : 2,
            HIT_LOVE : 3,
            EXPLOSION : 4,
            GET_ITEM : 5,
            GET_VIRTUE : 6,
            DEATH : 7
        },
    }

}