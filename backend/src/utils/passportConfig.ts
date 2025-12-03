import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { comparePassword } from '../utils/bcryptHash';
import User from '../models/User';

// Set up Passport local strategy for authentication
// Do we require username, email, or password to sign in? Or any of the above?
// We probably want a strategies folder if we plan to add oauth in addition to local.
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, done) => {
    try {
        const user = await User.findOne({ email }).select('+password').exec();
        if (!user) return done(null, false, { message: 'Invalid credentials' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

        return done(null, user);
    } catch (err) {
        return done(err as Error);
    }
    })
);

// Stores the authenticated user in the session. Not the entire object since that has privacy concerns.
passport.serializeUser((user: any, done) => done(null, user.id));

// Uses the session id to attach the corresponding user object to req.user
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) return done(new Error('User not found'));
        done(null, user); // Reattach the full user object to req.user
    } catch (err) {
        done(err as Error);
    }
});

export default passport;
