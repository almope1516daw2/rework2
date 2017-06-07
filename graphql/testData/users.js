import User from '../../data/model/User';
import {ROLES} from '../../config';

const user1 = new User({
  id: '1',
  role: ROLES.logged,
  email: 'reader@test.com',
  password: 'qwerty',
  firstName: 'Regina',
  lastName: 'Reader'
});

const user2 = new User({
  id: '2',
  role: ROLES.logged,
  email: 'publisher@hotmail.com',
  password: 'qwerty',
  firstName: 'Peter',
  lastName: 'Publisher'
});

const user3 = new User({
  id: '3',
  role: ROLES.logged,
  email: 'publisher2@test.com',
  password: 'qwerty',
  firstName: 'Peter',
  lastName: 'Publisher 2'
});

export const users = [user1, user2, user3];