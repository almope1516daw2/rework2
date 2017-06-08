import jwt from "jsonwebtoken";

import {secret} from "./config";
import {ROLES} from "../config";

export const ANONYMOUS_TOKEN_DATA = {role: ROLES.anonymous, userId: 'anonymous'};

export function createAnonymousToken() {
    return createToken();
}

export function createToken(userData) {
    console.log("CREATE TOKEN USER DATA: ");
    if (userData && userData.userId) {
        const {userId, role} = userData;
        log('create token with userId ' + userId);
        return jwt.sign({userId, role}, secret);
    }
    else {
        console.log("not token is created");
        return jwt.sign(ANONYMOUS_TOKEN_DATA, secret);
    }
}

export function decodeToken(token) {
    console.log("DECODE");
    return jwt.verify(token, secret);
}

export function hasAuthorization(actualRole, expectedRole, next) {
    if (actualRole === expectedRole) {
        return next();
    }
    else {
        return () => null;
    }
}