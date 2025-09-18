import Twilio, { Twilio as TwilioClient } from 'twilio';

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
    return this.client.messages.create({
      body,
      from: CONFIG.twilio.smsPhone,
      to,
    });
  }
}

export default TwilioService.getInstance();
