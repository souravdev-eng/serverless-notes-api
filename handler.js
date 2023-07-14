'use strict';
const DynamoDB = require('aws-sdk/clients/dynamodb');
/* The line `const documentClient = new DynamoDB.DocumentClient({ ... })` is creating a new instance of
the `DocumentClient` class from the AWS SDK for DynamoDB. */
const documentClient = new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000,
  },
});
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};
module.exports.createNote = async (event, context, cb) => {
  /* The line `context.callbackWaitsForEmptyEventLoop = false;` is setting the
  `callbackWaitsForEmptyEventLoop` property of the `context` object to `false`. */
  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: 'attribute_not_exists(notesId)',
    };
    await documentClient.put(params).promise();
    cb(null, send(201, data));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
module.exports.updateNote = async (event, context, cb) => {
  /* The line `context.callbackWaitsForEmptyEventLoop = false;` is setting the
  `callbackWaitsForEmptyEventLoop` property of the `context` object to `false`. */
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id;
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      UpdateExpression: 'set #title = :title, #body= :body',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body',
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body,
      },
      ConditionExpression: 'attribute_exists(notesId)',
    };
    await documentClient.update(params).promise();
    cb(null, send(200, data));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
module.exports.deleteNote = async (event, context, cb) => {
  /* The line `context.callbackWaitsForEmptyEventLoop = false;` is setting the
  `callbackWaitsForEmptyEventLoop` property of the `context` object to `false`. */
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      ConditionExpression: 'attribute_exists(notesId)',
    };
    await documentClient.delete(params).promise();
    cb(null, send(200, notesId));
  } catch (error) {
    cb(null, send(500, error.message));
  }
};
module.exports.getNotes = async (event, context, cb) => {
  /* The line `context.callbackWaitsForEmptyEventLoop = false;` is setting the
  `callbackWaitsForEmptyEventLoop` property of the `context` object to `false`. */
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = { TableName: NOTES_TABLE_NAME };
    const notes = await documentClient.scan(params).promise();
    cb(null, send(200, notes));
  } catch (error) {
    cb(null, send(500, error.message));
  }
};
