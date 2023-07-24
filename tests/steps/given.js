'use strict';
const AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';

const cognito = new AWS.CognitoIdentityServiceProvider();

const an_authenticated_user = async () => {
  const USER_POOL_ID = process.env.USER_POOL_ID;
  const USER_POOL_CLIENT_ID = process.env.CLIENT_ID;
  const USERNAME = process.env.AWS_USERNAME;
  const PASSWORD = process.env.AWS_PASSWORD;

  const params = {
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_CLIENT_ID,
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME: USERNAME,
      PASSWORD: PASSWORD,
    },
  };

  const user = await cognito.adminInitiateAuth(params).promise();
  return user;
};

module.exports = { an_authenticated_user };
