'use strict';
const DynamoDB = require('aws-sdk/clients/dynamodb');
const documentClient = new DynamoDB.DocumentClient({ region: 'ap-south-1' });
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};
module.exports.createNote = async (event, context, cb) => {
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

module.exports.updateNote = async (event) => {
  let notesID = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`Update notes with ID ${notesID}`),
  };
};
module.exports.deleteNote = async (event) => {
  let notesID = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`Delete notes with ID ${notesID}`),
  };
};
module.exports.getNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(`Get all notes`),
  };
};
