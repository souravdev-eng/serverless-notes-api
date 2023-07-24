'use strict';

let init = require('./steps/init');
let { an_authenticated_user } = require('./steps/given');
let idToken;

describe('Given an authenticated user', () => {
  beforeAll(async () => {
    init();
    const USERNAME = process.env.AWSUSERNAME;
    console.log('User name:', USERNAME);
    let user = await an_authenticated_user();
    idToken = user.AuthenticationResult.IdToken;
    console.log('*****', idToken);
  });

  it('Should success', () => {});
});
