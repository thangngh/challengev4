import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { helmetCSPConfig } from '../../../core/constants';
import { AppModule } from '../../../DDD/index';
import { passport } from '../../../core/config/passport.config';

const morganEnv = CONFIG.runningProd ? 'combined' : 'dev';
const app = express();
const AllRoutes = AppModule.getRouter();

app.use(helmet());
app.use(helmetCSPConfig);
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(morgan(morganEnv));
app.use(express.json());

app.use(passport.initialize());
app.use(CONFIG.api.prefix, AllRoutes);


export default app;