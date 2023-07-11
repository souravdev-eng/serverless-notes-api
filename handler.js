'use strict';

module.exports.createNote = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify('Creating new note'),
  };
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
