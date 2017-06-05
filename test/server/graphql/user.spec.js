import { fromGlobalId } from 'graphql-relay';

import Database from '../mock/DatabaseMock';
import createGraphQlServer from '../../../server/graphQlServer';

import { ROLES, Errors } from '../../../config';
import {decodeToken} from '../../../server/authentication';

describe('GraphQL User', () => {

  let database;
  let server;

  beforeEach(() => {
    database = new Database();
    server = createGraphQlServer(8080, database);
  });

  afterEach((done) => {
    server.close(done);
  });

  describe('login', () => {

    it('sets anonymous session to cookie if no session is provided', (done) => {
      const query = `
        {
          viewer {
            user {
               id
            }
          }
        }
      `;

      request(server)
        .get('/graphql')
        .query({query})
        .end((err, res) => {
          checkRequestErrors(res);

          expect(res.header['set-cookie'].length).to.be.at.least(1);
          expect(res.header['set-cookie'][0]).to.include('session');

          const session = getSessionFromResponseCookie(res);
          expect(session, 'session was parsed correctly').to.be.ok;

          const authToken = session.token;
          expect(authToken, 'auth token has been set').to.be.ok;

          const tokenData = decodeToken(authToken);
          expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.anonymous);
          done();
        });
    });

    it('updates cookie with authenticated session token after login', (done) => {
      const query = `
        mutation {
          login(input: {id: "${Database.viewerId}" email: "reader@test.com", password: "1234asdf", clientMutationId: "0"}) {
            user {
              id,
              email
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const user = withActualId(res.body.data.login.user);
          expect(user, 'user data is correct').to.deep.equal({id: Database.viewerId, email: 'reader@test.com'});

          const session = getSessionFromResponseCookie(res);
          expect(session, 'session was parsed correctly').to.be.ok;

          const authToken = session.token;
          expect(authToken, 'auth token has been set').to.be.ok;

          const tokenData = decodeToken(authToken);
          expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.logged);
          expect(tokenData.userId, 'user id is set correctly').to.equal('1');

          done();
        });
    });

    it('updates cookie with authenticated session token after login', (done) => {
      const query = `
      mutation {
        login(input: {id: "${Database.viewerId}" email: "reader@test.com", password: "1234asdf", clientMutationId: "0"}) {
          user {
            email
          }
        }
      }
    `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const session = getSessionFromResponseCookie(res);
          expect(session, 'session was parsed correctly').to.be.ok;

          const authToken = session.token;
          expect(authToken, 'auth token has been set').to.be.ok;

          const tokenData = decodeToken(authToken);
          expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.logged);

          done();
        });
    });

    it('returns user data after login', (done) => {
      const query = `
      mutation {
        login(input: {id: "${Database.viewerId}" email: "reader@test.com", password: "1234asdf", clientMutationId: "0"}) {
          user {
            email,
            firstName,
            lastName
          }
        }
      }
    `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const user = res.body.data.login.user;
          expect(user, 'user data is correct').to.deep.equal({
            email: 'reader@test.com',
            firstName: 'Hans',
            lastName: 'Franz'
          });

          done();
        });
    });

    it('returns error if user with email does not exist', (done) => {
      const query = `
        mutation {
          login(input: {id: "${Database.viewerId}" email: "invalid@test.com", password: "1234asdf", clientMutationId: "0"}) {
            user {
              id,
              email
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.login;
          expect(data, 'response does not contain user data').to.not.be.ok;

          const errors = res.body.errors;
          expect(errors, 'response contains error').to.be.ok;
          expect(errors.length, 'response contains one error').to.equal(1);
          expect(errors[0].message, 'error message is correct').to.equal(Errors.WrongEmailOrPassword);

          done();
        });
    });

    it('returns error if user with email does not exist', (done) => {
      const query = `
        mutation {
          login(input: {id: "${Database.viewerId}" email: "reader@test.com", password: "1234asd", clientMutationId: "0"}) {
            user {
              id,
              email
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.login;
          expect(data, 'response does not contain user data').to.not.be.ok;

          const errors = res.body.errors;
          expect(errors, 'response contains error').to.be.ok;
          expect(errors.length, 'response contains one error').to.equal(1);
          expect(errors[0].message, 'error message is correct').to.equal(Errors.WrongEmailOrPassword);

          done();
        });
    });

  });

  describe('logout', () => {

    it('resets token data to anonymous after logout', (done) => {

      const user = request.agent(server);

      login(ROLES.logged, user, () => {
        const query = `
          mutation {
            logout(input: {id: "${Database.viewerId}", clientMutationId: "0"}) {
              user {
                id,
                email
              }
            }
          }
        `;

        user.post('/graphql')
          .query({query})
          .end((err, res) => {
            checkRequestErrors(res);

            const session = getSessionFromResponseCookie(res);
            expect(session, 'session was parsed correctly').to.be.ok;

            const authToken = session.token;
            expect(authToken, 'auth token has been set').to.be.ok;

            const tokenData = decodeToken(authToken);
            expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.anonymous);
            done();
          });
      });
    });

  });

  describe('restricted', () => {

    it('personal data can be accessed when logged in', (done) => {

      const user = request.agent(server);

      login(ROLES.logged, user, () => {

        const query = `
          {
            viewer {
              user {
                firstName,
                lastName
              }
            }
          }
        `;

        user.post('/graphql')
          .query({query})
          .expect(200)
          .end((err, res) => {
            checkRequestErrors(res);

            const userData = res.body.data.viewer.user;
            expect(userData).to.deep.equal({firstName: 'Hans', lastName:'Franz'});

            done();
          });

      });
    });

    it('personal data is empty when not logged in', (done) => {

      const query = `
        {
          viewer {
            user {
              firstName,
              lastName
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const userData = res.body.data.viewer.user;
          expect(userData).to.deep.equal({firstName: null, lastName: null});

          done();

        });
    });

    it('posts can be accessed when logged in', (done) => {

      const user = request.agent(server);

      login(ROLES.logged, user, () => {

        const query = `
          {
            viewer {
              user {
                id
              }
            }
          }
        `;

        user.post('/graphql')
          .query({query})
          .expect(200)
          .end((err, res) => {
            checkRequestErrors(res);

            const userData = res.body.data.viewer.user;



            done();
          });

      });
    });

    it('posts are empty when not logged in', (done) => {

      const query = `
        {
          viewer {
            user {
              id
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const userData = res.body.data.viewer.user;

          done();

      });
    });

  });

});