'use strict'

const firebase = require('firebase-admin');
const serviceAccount = require('../config/platzi-overflow-7af30-firebase-adminsdk-4veby-a775ca57ba.json');


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://platzi-overflow-7af30.firebaseio.com/'
})

const db = firebase.database()

const Users = require('./users');
const Questions = require('./questions');

module.exports = {
    users: new Users(db),
    questions: new Questions(db)
}
