export type Config = {

    // Speed of movements
    speed: {
        z: number;
        e: number;
        xy: number;
    },

    // How to extrude
    extrusion: {
        height: number,
        zHop: number,
    }
};

export const CONFIG_DEFAULTS: Config = {

    // Going conservative here
    speed: {
        e: 10,
        z: 50,
        xy: 100
    },

    // Sane defaults
    extrusion: {
        height: 0.2,
        zHop: 2
    }
}