const admin = require("firebase-admin");

const serviceAccount = require("../../../noortekunst-firebase-adminsdk-qqj7s-81b0305fde.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.log("Firebase Admin already initialized");
}

export default admin;