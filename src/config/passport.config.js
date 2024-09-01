import passport from "passport";
import local from "passport-local";

import config from "./config.js";

import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

import { authService } from "../services/AuthService.js";
import { UserService } from "../services/services.js";

const localStrategy = local.Strategy;

const initializePassportConfig = () => {
  passport.use(
    "register",
    new localStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        const { firstName, lastName, birthDate, role } = req.body;

        if (!firstName || !lastName) {
          return done(null, false, {
            message: "incomplete values",
            httpCode: 400,
          });
        }

        const user = await UserService.getUserbyEmail(email);

        if (user) {
          return done(null, false, {
            message: "user already exists",
            httpCode: 400,
          });
        }

        let parsedDate;

        if (birthDate) {
          parsedDate = new Date(birthDate).toISOString();
        }

        const hashedPassword = await authService.hashPassword(password);
        const newUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          birthDate: parsedDate,
          password: hashedPassword,
          role,
        };

        const result = await UserService.createUser(newUser);

        return done(null, result);
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await UserService.getUserbyEmail(email);

        if (!user) {
          return done(null, false, {
            message: "incorrect credentials",
            httpCode: 401,
          });
        }

        const isValidPassword = await authService.validatePassword(
          password,
          user.password
        );

        if (!isValidPassword) {
          return done(null, false, {
            message: "incorrect credentials",
            httpCode: 400,
          });
        }
        return done(null, user);
      }
    )
  );

  passport.use(
    "current",
    new JWTStrategy(
      {
        secretOrKey: config.app.JWT.KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (payload, done) => {
        return done(null, payload);
      }
    )
  );
};

function cookieExtractor(req) {
  return req?.cookies?.["sid"];
}

export default initializePassportConfig;
