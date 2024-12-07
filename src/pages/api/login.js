import { createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebaseApp)
export default async function POST(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                return res.status(200).json({message: 'Login successful', email})
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return res.status(400).json()
            });
    } else {
        res.status(405).json({ message: 'Login unsuccessful' });
    }
}