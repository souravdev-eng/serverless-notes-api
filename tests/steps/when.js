'use strict';
const _ = require('lodash');
const Promise = this.Promise || require('promise');
const agent = require('superagent-promise')(require('superagent'), Promise);

const makeHttpRequest = async (path, method, options) => {
  const API_END_POINT = process.env.TEST_ROOT;

  const url = options.notesId
    ? `${API_END_POINT}/${path}/${options.notesId}`
    : `${API_END_POINT}/${path}`;
  console.log('************', url);

  let httpReq = agent(method, url);
  const body = _.get(options, 'body');
  const idToken = _.get(options, 'idToken');

  try {
    httpReq.set('Authorization', idToken);
    if (body) {
      httpReq.send(body);
    }
    let res = await httpReq;
    return {
      statusCode: res.status,
      body: res.body,
    };
  } catch (error) {
    return {
      statusCode: error.status,
      body: null,
    };
  }
};

exports.we_invoke_createNote = (options) => {
  let response = makeHttpRequest('notes', 'POST', options);
  return response;
};

exports.we_invoke_updateNote = (options) => {
  let response = makeHttpRequest('notes', 'PUT', options);
  return response;
};

exports.we_invoke_deleteNote = (options) => {
  let response = makeHttpRequest('notes', 'DELETE', options);
  return response;
};
