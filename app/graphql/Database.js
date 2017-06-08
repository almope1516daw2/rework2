import {Errors, ROLES} from "../config";
import pbkdf2 from "pbkdf2";
import randomBytes from "randombytes";
import User from "../data/model/User";
import UserMongo from "./mongo/UserMongo";
import DomainMongo from "./mongo/DomainMongo";

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
        return new Promise((resolve, reject) => {
            let newObj;

            UserMongo.findOne({userId: id}).exec((err, res) => {
                if (res === null) {
                    throw new Error(Errors.WrongEmailOrPassword);
                }
                else {
                    console.log("USER FROM DB: ");
                    newObj = res.toObject();
                    delete newObj.__v;
                    delete newObj._id
                    console.log(newObj);

                }
                err ? reject(err) : resolve(newObj);
            });

        });
    }

    getUserWithCredentials(email, password) {
        return new Promise((resolve, reject) => {
            let newObj;
            UserMongo.findOne({email: email}).exec((err, res) => {
                if (res === null) {
                    throw new Error(Errors.WrongEmailOrPassword);
                }
                else {

                    let hash = pbkdf2.pbkdf2Sync(password, res.salt, 1000, 64).toString('hex');
                    if(hash === res.hash){
                        newObj = res.toObject();
                        delete newObj.__v;
                        delete newObj._id;

                        err ? reject(err) : resolve(newObj);
                    } else {
                        throw new Error(Errors.WrongEmailOrPassword);
                    }


                }

            });
        });
    }

    createUser(email, password, firstName, lastName, image, role) {


        return new Promise((resolve, reject) => {
            UserMongo.findOne({email: email}).exec((err, res) => {
                if (res === null) {

                    let domainName = email.substr(email.indexOf("@") + 1);
                    DomainMongo.findOne({names: domainName}).exec((err, res) => {
                        if (res !== null) {
                            console.log("FOUND MAIL: " + res.names + " | " + res.quantity);
                            if (res.quantity !== 0) {

                                console.log("FOUND MAIL: " + res.names + " | " + res.quantity);
                                res.quantity--;
                                res.save();

                                let salt = randomBytes(16).toString('hex');
                                let hash = pbkdf2.pbkdf2Sync(password, salt, 1000, 64).toString('hex');


                                let newUser = new UserMongo({
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    image: image,
                                    salt: salt,
                                    hash: hash,
                                    role: role
                                });

                                console.log(newUser);
                                let apiKey = 'key-1aae833bae423813bf1e81d378dc216b';
                                 let domain = 'sandboxaa708984991b4bfd86c8d8fa759302c8.mailgun.org';
                                 let mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});
                                 let data = {
                                 from: 'Mifisio <postmaster@sandboxaa708984991b4bfd86c8d8fa759302c8.mailgun.org>',
                                 to: email,
                                 subject: 'Gracias por registrarte',
                                 text: 'Saludos ' + firstName + " " + lastName + ".\n Gracias por registrarte en Mifisio."
                                 };
                                 mailgun.messages().send(data, function (error, body) {
                                 });


                                newUser.save((err, res) => {
                                    console.log("ERROR")
                                    console.log(err)
                                    console.log("RES")
                                    console.log(res)


                                    let newObj = res.toObject();
                                    delete newObj.__v;
                                    delete newObj._id;

                                    console.log(newObj);
                                    err ? reject(err) : resolve(newObj);
                                });
                            } else {
                                console.log("NOT AVALIABLE");
                                throw new Error(Errors.DomainNotAvaliable);

                            }

                        } else {
                            console.log("NULL MAIL");
                            throw new Error(Errors.DomainNotCorrect);
                        }
                    });

                }
                else {
                    console.log("User already registered");
                    throw new Error(Errors.EmailAlreadyTaken);
                }
            });


        });
    }

}