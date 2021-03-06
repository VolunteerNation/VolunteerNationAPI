const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');

const AWS_IP = "3.88.34.151";
const MONGODB_CONN_STRING = "mongodb://admin:ZGIuY3JlYXRlVXNlIGFrbGRmYWxrZGZqYSBkZgo=@" + AWS_IP + ":9999/?authSource=admin";
const PROFILE_API_PREFIX = '/vnt_profile';
const USER_API_PREFIX = '/vnt_user';
const POST_API_PREFIX = '/vnt_post';
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

// const authMiddleware = () => jwt({
//     secret: secret,
//     // audience: audience,
//     // issuer: issuer,
//     algorithms: ["HS256"]
// });

const authMiddleware = (req, res, next) => {
  console.log('token attempting to verify');
  const token = req.header('auth-token');
  console.log(token);
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  console.log(token);
  try {
    const verified = jsonwebtoken.verify(token, secret);
    console.log(verified);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

const createToken = (email) => {
  console.log("createToken called");
  const token = jsonwebtoken.sign({email: email}, secret,
    {
      audience: audience,
      issuer: issuer
    }
  );
  console.log("createToken complete");
  return token;
};

module.exports = {
  authMiddleware,
  createToken,
  successMsg,
  errorMsg,
  secret,
  audience,
  issuer,
  AWS_IP,
  MONGODB_CONN_STRING,
  PROFILE_API_PREFIX,
  USER_API_PREFIX,
  POST_API_PREFIX,
  PORT
}
