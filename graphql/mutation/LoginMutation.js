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
    const user = db.getUserWithCredentials(email, password);
    console.log("USER: ");
    console.log(user);
    if (user) {

      rootValue.session.token = createToken(user);
      rootValue.tokenData = decodeToken(rootValue.session.token);

    }
    return user;
  }
});