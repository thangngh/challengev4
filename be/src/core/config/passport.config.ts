import passport from 'passport';

// Serialization (not needed for JWT, but required for Passport)
passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done: (error: any, user?: any) => void) => {
  done(null, obj);
});

export { passport };