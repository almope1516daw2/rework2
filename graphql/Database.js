import {users} from './testData/users';
import {ROLES, Errors} from '../config';

import User from '../data/model/User';
import UserMongo from './mongo/UserMongo';

const viewerId = 'qoyciemasklfhkel';

export default class Database {




  getAnonymousUser() {
    log('get anonymous user');
    return new User({id: viewerId, role: ROLES.anonymous});
  }

  getViewerById(id) {
    log('get user by id ' + id);
    if (!id || id === 'anonymous') {
      return this.getAnonymousUser();
    }

    const user = this._copy(users.find(user => user.id === id));
    if (user) {
      user.userId = user.id;
      user.id = viewerId;
    }
    return user;
  }

  getUserWithCredentials(email, password) {
    let found = false;
    let tempUser;
      UserMongo.findOne({mail: email}).exec((err, res) => {
          if(res===null) {
              console.log('caca');
              throw new Error(Errors.WrongEmailOrPassword);
          }
          else {
              console.log("USER FOUND: ");
              console.log(res);
              found = true;
              tempUser = res;
              return tempUser;
              //tempUser = new User({res.mail, password, firstName, lastName, role});
             /* let tempMail = res.mail;
              let tempFirst = res.name;
              let tempLast = res.surname;
              tempUser = new User({tempMail, tempFirst, tempLast});
              tempUser.id = '4';
              tempUser.role = ROLES.logged;
              console.log("TEMP USER: ")
              console.log(tempUser)*/

          }
      });
      //const user = this._copy(tempUser);
    //console.log(user);
/*
    if (!found) {
        console.log("THROW ERROR");
      //throw new Error(Errors.WrongEmailOrPassword);
    }
    console.log("AFTER");
    // We exchange the actual id with our static viewerId so that the anonymous user and the logged in user have the same id.
    // Because of this the user in relay store will be updated and corresponding components rerendered. If anonymous and
    // logged in user don't share the same id, the data for anonymous user will stay in the store and components will
    // only be updated after refresh (store is deleted and user will be refetched based on session data)
    //user.userId = user.id;
    //user.id = viewerId;
    //return user;
    return tempUser;*/
  }

  createUser(email, password, firstName, lastName, role) {
    const existingUser = users.find(user => user.email == email);

    if (existingUser) {
      throw new Error(Errors.EmailAlreadyTaken);
    }

      let newUser = new UserMongo({
          name: firstName,
          surname: lastName,
          mail: email,
          image: 'preview.png'

      });

      /*
    const newUser = new User({email, password, firstName, lastName, role});
    newUser.id = "" + (users.length + 1);
    users.push(newUser);*/

      return new Promise((resolve, reject) => {
          newUser.save((err, res) => {
              err ? reject(err) : resolve(res);
          });
      });
    //return {user: newUser};

  }

  _copy(object) {
    if (!object) {
        console.log("NOPE");
      return object;
    }

    return {... object};
  }

}