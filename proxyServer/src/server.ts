'use strict'
import app from './app';
import { logger } from './utils/logger';
import EventHandler from './events';

const run = async () => {
    await EventHandler.getInstance().connect(process.env.REDIS_SERVER || 'redis://localhost:6379', 'proxy_ch');
    app.listen(process.env.PORT || 3000, () => {
        logger.info(`Server started at port ${process.env.PORT || 3000}`);
    });
}

run().catch(logger.warn)

