import { ConfigService } from "../../core/config";

export class InitGlobals {
  public static init() {
    global.CONFIG = ConfigService.getInstance().getConfig();
  }
}