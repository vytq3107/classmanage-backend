const admin = require('firebase-admin');

const serviceAccount = require('./key/classroom-database-d5341-firebase-adminsdk-fbsvc-a87b610320.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://classroom-database-d5341-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();

module.exports = {
  admin,
  db
};
