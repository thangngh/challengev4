import { RouterModule } from "./router";

export class AppModule {
  public static router: RouterModule;

  public static getRouter() {
    return RouterModule.getRouter();
  }


}