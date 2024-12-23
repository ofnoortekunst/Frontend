const admin = require("firebase-admin");

const serviceAccount = require("../../../noortekunst-firebase-adminsdk-qqj7s-81b0305fde.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


export default async function POST(req, res) {
    const { uid, password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Vale parool' });
    }

    try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        res.status(200).json({ message: `Kasutaja ${uid} on edukalt adminiks määratud` });
    } catch (error) {
        console.error('Error setting custom claims:', error);
        res.status(500).json({ error: 'Admini määramisel tekkis viga', details: error.message });
    }
}