import passport from 'passport';
import jwt from 'passport-jwt';
import UserDomain from '../domain/userDomain.js';

const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = jwt;

const getAuthTokenFromHeader = (req) => {
  if (req?.headers?.authorization) {
    return req.headers.authorization.split(' ')[1];
  }
};

const InitPassport = () => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          return done(null, payload);
        } catch (error) {
          console.error(
            'Error en el callback de InitPassport.JWTStrategy',
            error
          );
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserDomain.getUserById(id);
    done(null, user);
  });
};

export default InitPassport;
