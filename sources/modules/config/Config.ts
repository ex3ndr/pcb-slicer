export type Config = {

    // Speed of movements
    speed: {
        z: number;
        e: number;
        xy: number;
        xyTravel: number;
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
        e: 40,
        z: 20,
        xy: 5,
        xyTravel: 200,
    },

    // Sane defaults
    extrusion: {
        height: 0.15,
        zHop: 2
    }
}