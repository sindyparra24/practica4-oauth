import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';

export function configureGoogleStrategy() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.warn('Faltan variables de entorno de Google OAuth');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Buscar usuario por googleId
          let user = await User.findOne({
            provider: 'google',
            googleId: profile.id
          });

          // Si no existe, se crea
          if (!user) {
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null;

            user = await User.create({
              nombre: profile.displayName,
              email: email,
              provider: 'google',
              googleId: profile.id
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}
