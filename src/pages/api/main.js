const admin = require("firebase-admin");

const serviceAccount = require("../../../noortekunst-firebase-adminsdk-qqj7s-81b0305fde.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Add authentication helper function
export async function authenticateUser(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return { userId: decodedToken.uid };
  } catch (error) {
    console.log("Error verifying token:", error.message);
    throw new Error("Invalid authentication token");
  }
}

export default admin;