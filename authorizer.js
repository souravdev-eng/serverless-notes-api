const { CognitoJwtVerifier } = require('aws-jwt-verify');
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: 'ap-south-1_2yNePzxdW',
  tokenUse: 'id',
  clientId: '5nuogvmp6lk26t06ss1s9h6d4n',
});

/**
 * The function generates an authorization policy with a principal ID, effect, and resource.
 * @param principalId - The principalId parameter represents the identifier of the user or entity
 * making the request. It is typically used to identify the user or entity for authentication and
 * authorization purposes.
 * @param effect - The "effect" parameter in the generatePolicy function is used to specify whether the
 * access to the resource is allowed or denied. It can have two possible values: "Allow" or "Deny".
 * @param resource - The `resource` parameter is a string that represents the resource that the policy
 * applies to. It typically follows the format of an Amazon Resource Name (ARN) and specifies the
 * specific API endpoint or resource that the policy grants access to.
 * @returns The function `generatePolicy` returns an object with the following properties:
 */
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    let policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: effect,
          Resource: resource,
          Action: 'execute-api:Invoke',
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }
  authResponse.context = { foo: 'bar' };
  console.log(JSON.stringify(authResponse));
  return authResponse;
};

exports.handler = async (event, context, cb) => {
  const token = event.authorizationToken; // "allow" or "deny"

  // Validate the token
  console.log(token);
  try {
    const payload = await jwtVerifier.verify(token);
    console.log(JSON.stringify(payload));
    cb(null, generatePolicy('user', 'Allow', event.methodArn));
  } catch (error) {
    cb('Error: Invalid token');
  }
};
