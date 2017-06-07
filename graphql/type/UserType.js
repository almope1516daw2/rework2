import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, connectionFromArray, globalIdField, fromGlobalId } from 'graphql-relay';

import { NodeInterface } from '../interface/NodeInterface';

import User from '../../data/model/User';
import {ROLES} from '../../config';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    userId: {
      description: 'user id for current viewer',
      type: GraphQLString
    },
    email: {
      description: 'the users email address',
      type: GraphQLString
    },
    firstName: {
      description: 'the users first name',
      type: GraphQLString
    },
      lastName: {
          description: 'the users last name',
          type: GraphQLString
      },
      image: {
          description: 'the users image',
          type: GraphQLString
      },
    role: {
      description: 'the users role',
      type: GraphQLString
    }
  },
  interfaces: [NodeInterface]
});