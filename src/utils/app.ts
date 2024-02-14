let tokenTimer: any;
let responseListener: any = {};
let disabledBack: boolean;

export function getNewToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!appIsActive()) {
      reject("App is not active");
      return;
    }
    getAndroidApp().requestChangeUserToken();

    responseListener.newToken = (newToken: string) => {
      resolve(newToken);
      setTimeout(() => {
        delete responseListener.newToken;
      });
    };
  });
}

export function getUserToken(): string | undefined {
  if (!appIsActive()) {
    return;
  }
  return getAndroidApp().getUserToken();
}

export function closeApp() {
  if (!appIsActive()) {
    return;
  }
  getAndroidApp().closeApp();
}

export function getClientVersion():
  | { platform: "Android" | "IOS"; version: string }
  | undefined {
  if (!appIsActive()) {
    return;
  }
  return getAndroidApp().getClientVersion();
}

export function disableBack(isDisable: boolean) {
  disabledBack = isDisable;
}

function updateToken() {
  if (tokenTimer) {
    clearTimeout(tokenTimer);
  }
  tokenTimer = setTimeout(() => {
    getNewToken().then((newToken: string) => {
      updateToken();
    });
  }, 15 * 60000);
}

function appIsActive() {
  return getAndroidApp() !== undefined;
}

function getWindow() {
  return window as any;
}

function getAndroidApp() {
  return getWindow().androidApp;
}
