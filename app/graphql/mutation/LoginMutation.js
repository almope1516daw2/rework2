import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { createToken, decodeToken } from '../../server/authentication';
import UserType from '../type/UserType';

export default mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: (payload) => payload
    }
  },
  mutateAndGetPayload: ({ email, password }, { db }, { rootValue }) => {
    log('get user with credentials. email: ' + email + '  password: ' + password);
    return db.getUserWithCredentials(email, password).then(function(result) {
          if (result) {
              rootValue.session.token = createToken(result);
              console.log("TOKEN CREATED:");
              console.log(rootValue.session.token);
              console.log("BEFORE DECODE: ");
              console.log(rootValue.tokenData);
              rootValue.tokenData = decodeToken(rootValue.session.token);
              console.log("AFTER: ");
              console.log(rootValue.tokenData);

          }
          return result;
      });


  }
});