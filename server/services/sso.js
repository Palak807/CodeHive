import passport from 'passport';
import jwt from "jsonwebtoken";

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GithubStrategy } from 'passport-github2';
import {
    FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_KEY,
    GITHUB_SECRET
} from '../config/index.js';
import { findOrCreateuser } from './users.js';



passport.serializeUser((user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `/auth/google/callback`
    },
    ssoService
));
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email']
},
    ssoService));

passport.use(new GithubStrategy({
    clientID: GITHUB_KEY,
    clientSecret: GITHUB_SECRET,
    callbackURL: `/auth/github/callback`,
    scope: ['r_emailaddress', 'r_liteprofile'],
},
    ssoService));


const redirect = {
    failureRedirect: 'http://localhost:3000/',
    session: true,
    successFlash: false
};
const googleLogin = passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
});
const googleCallback = passport.authenticate('google', redirect);
const facebookLogin = passport.authenticate('facebook', { scope: ['email', 'public_profile','user_location'] });
const facebookCallback = passport.authenticate('facebook', redirect);
const githubLogin = passport.authenticate('github', { scope: [ 'user','user:email','read:user' ] });
const githubCallback = passport.authenticate('github', redirect);

// const authService = new AuthService();
// serialise user for sessions need to add deserilalze for logout

export const  createToken = (req, res) =>{
    const token = jwt.sign({ id: req.session.passport.user.id}, process.env.JWT_SECRET);
    res.redirect(`http://localhost:3000/login/oauth?token=${token}`)    
}

async function  ssoService  (accessToken, refreshToken, profile, done)  {

    // console.log("accessToken: ", accessToken);
    try {
        // console.log(profile);
        const user = await extractProfile(profile, accessToken);
        const { err, findUser } = await findOrCreateuser(user);
        const sessUser = { email: findUser.email, id: findUser.id };
        // console.log("session: ", sessUser);
        return done(err, sessUser);
    } catch (error) {
        return done(error);

    }
}

async function  extractProfile(profile, accessToken) {
    if(profile.provider === 'google') {
        const email = profile.emails[0].value; // get email address
        const firstName = profile.name.familyName;
        const lastName = profile.name.givenName;
        const dp =  profile.photos[0].value;
        const user = { email, firstName, lastName, profile:dp ,login: profile.provider.toUpperCase() };
        return user;
    }
    if(profile.provider === 'github') {
        // console.log(profile);
        const email = profile.username; // get email address
        const firstName = profile.displayName.split(' ')[0];
        const lastName = profile.displayName.split(' ')[1];
        const dp =  profile.photos[0].value;
        const user = { email, firstName, lastName, profile:dp ,login: profile.provider.toUpperCase() };
        return user;
        
    }
    if(profile.provider ==='facebook') {
        const email = profile.emails[0].value; // get email address
        const firstName = profile.displayName.split(' ')[0];
        const lastName = profile.displayName.split(' ')[1];
        const res = await fetch(`https://graph.facebook.com/${profile.id}/picture?type=large&redirect=false&access_token=${accessToken}`,
        {method: 'GET'}
        )
        const resJson =  await res.json()
        const dp =resJson.data.url;
        console.log("dp: " ,dp);
        const user = { email, firstName, lastName, profile:dp ,login: profile.provider.toUpperCase() };
        return user;
        
        
    }
}


export { passport, googleLogin, googleCallback, facebookLogin, facebookCallback, githubLogin, githubCallback }