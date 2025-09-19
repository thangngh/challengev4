import Twilio, { Twilio as TwilioClient } from 'twilio';
import { LOGGER } from '../logger';

class TwilioService {
  private static instance: TwilioService;
  private client: TwilioClient;

  private constructor() {
    this.client = Twilio(CONFIG.twilio.sid, CONFIG.twilio.token);
  }

  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    }
    return TwilioService.instance;
  }

  async sendSms(to: string, body: string) {
    try {
      return await this.client.messages.create({
        body,
        from: CONFIG.twilio.smsPhone,
        to,
      });
    } catch (error) {
      LOGGER.error('Failed to send SMS via Twilio', error);
      throw error;
    }
  }
}

export default TwilioService.getInstance();
