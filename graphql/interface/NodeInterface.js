import { nodeDefinitions, fromGlobalId } from "graphql-relay";

import UserType from '../type/UserType';

import User from '../../data/model/User';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, { db }) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {

      case 'User':
        log('NodeInterface: get user with id ' + id);
        return db.getViewerById(id);


      default:
        return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return UserType;
    }

  }
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;