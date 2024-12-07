import firebaseApp from "../../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebaseApp)
export default async function POST(req, res) {
    if (req.method === "POST") {
        const { email, psw } = req.body;
        console.log(email, psw)
        createUserWithEmailAndPassword(auth, email, psw)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const uid = user.uid
                return res.status(200).json({message: 'Registration successful', email})
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return res.status(400).json()
            });
    } else {
        res.status(405).json({ message: 'Registration unsuccessful' });
    }
}