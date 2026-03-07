//  events to trigger to reduce tight coupling
export const authEvents = {
  USER_REGISTERED: "auth.user.registered",
  PASSWORD_RESET_REQUESTED: "auth.password.reset.requested",
  PASSWORD_CHANGED: "auth.password.changed",
  USER_LOGGED_IN: "auth.user.loggedIn",
  USER_LOGGED_OUT: "auth.user.loggedOut",
} as const;
