import { GraphQLObjectType, GraphQLString} from "graphql";
import { connectionArgs, connectionFromArray, globalIdField, fromGlobalId } from 'graphql-relay';

import UserType from "./UserType";

import { ROLES } from '../../config';

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type:  UserType,
      resolve: (obj, args, { db }, { rootValue: {tokenData } })  => {
        // tokenData origins from a cookie containing session data.
        // this is necessary to make session data persistent over refreshing the browser
        if (tokenData && tokenData.userId && tokenData.role && tokenData.role !== ROLES.anonymous) {
          return db.getViewerById(tokenData.userId);
        }
        else {
          return db.getAnonymousUser();
        }
      }
    }
  })
});