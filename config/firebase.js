const admin = require('firebase-admin');

const serviceAccount = require('./key/classroom-database-d5341-firebase-adminsdk-fbsvc-1340bb99f0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://classroom-database-d5341-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();

module.exports = {
  admin,
  db
};
