import { APIGatewayTokenAuthorizerEvent, Context, AuthResponse } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID!;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID!;

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USERPOOL_ID,
  tokenUse: 'id',
  clientId: COGNITO_WEB_CLIENT_ID,
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
const generatePolicy = (principalId, effect, resource): AuthResponse => {
  const authResponse = {} as AuthResponse;
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


export const handler = async (event: APIGatewayTokenAuthorizerEvent, context: Context, cb: any) => {
  const token = event.authorizationToken; // "allow" or "deny"

  try {
    const payload = await jwtVerifier.verify(token);
    console.log(JSON.stringify(payload));
    cb(null, generatePolicy('user', 'Allow', event.methodArn));
  } catch (error) {
    cb('Error: Invalid token');
  }
};
