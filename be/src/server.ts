/// <reference path="./types/global.d.ts" />

import { InitGlobals } from "./helpers/config/initGlobals";
InitGlobals.init();

import { WebServer } from "./core/framework";
import { LOGGER } from "./core/framework"
async function startServer() {
    try {
        global.APP = WebServer.app;
        LOGGER.info(`Server running on port ${CONFIG.port}`);
        APP.listen(CONFIG.port, () => {
            console.log(`Server running on port ${CONFIG.port}`);
        });
    } catch (error) {
        throw error;
    }
}

startServer();