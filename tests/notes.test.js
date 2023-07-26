'use strict';

let init = require('./steps/init');
let { an_authenticated_user } = require('./steps/given');
let { we_invoke_createNote, we_invoke_updateNote, we_invoke_deleteNote } = require('./steps/when');
let idToken;

describe('Given an authenticated user', () => {
  beforeAll(async () => {
    init();
    let user = await an_authenticated_user();
    idToken = user.AuthenticationResult.IdToken;
    console.log(idToken);
  });

  describe('When we invoke POST /notes endpoint', () => {
    it('Should create a new note', async () => {
      let body = {
        id: '1',
        title: 'Test',
        body: 'test body',
      };

      let result = await we_invoke_createNote({ idToken, body });
      expect(result.statusCode).toEqual(201);
      expect(result.body).not.toBeNull();
    });
  });

  describe('When we invoke UPDATE /notes/:id endpoint', () => {
    it('Should update a new note', async () => {
      const notesId = '1';
      const body = { title: 'My Updated Notes', body: 'My Updated Notes body' };

      const result = await we_invoke_updateNote({ idToken, body, notesId });

      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toBeNull();
    });
  });
  describe('When we invoke DELETE /notes/:id endpoint', () => {
    it('Should delete a new note', async () => {
      const notesId = '1';

      const result = await we_invoke_deleteNote({ idToken, notesId });

      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toBeNull();
    });
  });
});
