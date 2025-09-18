import 'dotenv/config'

export interface Config {
  runningProd: boolean;
  app: string;
  port: number;
  api: {
    prefix: string;
    auth: {
      prefix: string;
    };
  };
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpireTime: string;
    refreshTokenExpireTime: string;
    tokenIssuer: string;
  };
  rate: {
    limit: number;
    max: number;
    excludePaths: string[];
  };
  bruteForce: {
    freeRetries: number;
    minWait: number;
    maxWait: number;
    lifetime: number;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    fromName: string;
    templates: {
      path: string;
      cache: boolean;
    };
  };
  twilio: {
    sid: string;
    token: string;
    smsPhone: string
  },
  firebase: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
    databaseUrl: string
  },
  bcrypt: {
    saltRounds: number;
  };
  session: {
    secret: string;
  };
  logger: {
    level: string;
    appLogsDir: string;
    errorLogsDir: string;
    maxSize: string;
    maxFiles: string;
  };
}

export class ConfigService {
  private static instance: ConfigService;
  private config: Config;

  constructor () {
    this.config = {
      runningProd: process.env.NODE_ENV === 'production',
      app: process.env.APP_NAME || 'challengev4',
      port: parseInt(process.env.PORT || '5095', 10),
      api: {
        prefix: process.env.API_PREFIX || '/api/v1',
        auth: {
          prefix: process.env.AUTH_PREFIX || '/auth',
          },
      },
      jwt: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
        accessTokenExpireTime: process.env.ACCESS_TOKEN_EXPIRE_TIME || '1h',
        refreshTokenExpireTime: process.env.REFRESH_TOKEN_EXPIRE_TIME || '7d',
        tokenIssuer: process.env.TOKEN_ISSUER || 'your-issuer',
      },
      rate: {
        limit: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes in milliseconds
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
        excludePaths: (
          process.env.RATE_LIMIT_EXCLUDE_PATHS || '/checker/admin/queues'
        ).split(','),
      },
      bruteForce: {
        freeRetries: parseInt(process.env.BRUTE_FORCE_FREE_RETRIES || '5', 10),
        minWait: parseInt(process.env.BRUTE_FORCE_MIN_WAIT || '300000', 10), // 5 minutes
        maxWait: parseInt(process.env.BRUTE_FORCE_MAX_WAIT || '3600000', 10), // 1 hour
        lifetime: parseInt(process.env.BRUTE_FORCE_LIFETIME || '86400', 10), // 1 day in seconds
      },
      mail: {
        host:
          process.env.NODE_ENV === 'production'
            ? process.env.SMTP_HOST || ''
            : process.env.MAILDEV_HOST || 'localhost',
        port: parseInt(
          process.env.NODE_ENV === 'production'
            ? process.env.SMTP_PORT || '587'
            : process.env.MAILDEV_PORT || '1025',
          10,
        ),
        user:
          process.env.NODE_ENV === 'production'
            ? process.env.SMTP_USER || ''
            : '',
        pass:
          process.env.NODE_ENV === 'production'
            ? process.env.SMTP_PASS || ''
            : '',
        from: process.env.FROM_EMAIL || 'no-reply@myapp.com',
        fromName: process.env.FROM_NAME || 'Your Service Name',
        templates: {
          path: process.env.MAIL_TEMPLATES_PATH || 'templates',
          cache: process.env.NODE_ENV === 'production',
        },
      },
      twilio: {
        sid: process.env.TWILIO_SID || 'twilio_sid',
        token: process.env.TWILIO_TOKEN || 'twilio_token',
        smsPhone: process.env.TWILIO_SMS_PHONE || '1234'
      },
      firebase: {
        projectId: process.env.FIREBASE_PROJECTID || '123',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebae@gmail.com',
        privateKey: process.env.FIREBASE_PRIVATEKEY || '123',
        databaseUrl: process.env.FIREBASE_DATABASE || '123',
      },
      bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
      },
      session: {
        secret: process.env.SESSION_SECRET || 'your-session-secret',
      },
      logger: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        appLogsDir: process.env.LOG_APP_DIR || 'logs/app',
        errorLogsDir: process.env.LOG_ERROR_DIR || 'logs/error',
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
      },
    }
  } 

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getConfig(): Config {
    return this.config;
  }
}