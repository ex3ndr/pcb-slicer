export type Config = {

    // Speed of movements
    speed: {
        z: number;
        e: number;
        xy: number;
    },

    // How to extrude
    extrusion: {
        nozzle: number,
        height: number,
        zHop: number,
    }
};

export const CONFIG_DEFAULTS: Config = {

    // Going conservative here
    speed: {
        e: 40,
        z: 5,
        xy: 5
    },

    // Sane defaults
    extrusion: {
        nozzle: 0.23, // Disposable nozzles are 0.23mm
        height: 0.15,
        zHop: 2
    }
}