const AWS_IP = "3.88.34.151";
const CONN_STRING = "mongodb://admin:ZGIuY3JlYXRlVXNlIGFrbGRmYWxrZGZqYSBkZgo=@" + AWS_IP + ":9999/?authSource=admin";
const PROFILE_API_PREFIX = '/vnt_profile';
const USER_API_PREFIX = '/vnt_user';
const PORT = 4000;
const secret = 'secret';
const audience = 'http://myapi/protected';
const issuer = 'http://issuer';

const successMsg = (msg) => {
    return {
        msg: msg
    };
}
const errorMsg = (msg) => {
    return {
        msg: msg
    };
}

function createToken() {
    const token = jsonwebtoken.sign({foo: 'bar'}, secret, {
        audience,
        issuer
    });
    return token;
}

module.exports = {
    createToken,
    successMsg,
    errorMsg,
    secret,
    audience,
    issuer,
    AWS_IP,
    CONN_STRING,
    PROFILE_API_PREFIX,
    USER_API_PREFIX,
    PORT
}
