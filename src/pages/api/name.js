import { PrismaClient } from '@prisma/client'
import admin from "./main"

const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method === "POST") {
        var { idToken, name} = req.body;
        if (name) {
        try {
            try {
              const decodedToken = await admin.auth().verifyIdToken(idToken);
              const authorId = decodedToken.uid;
              var user_id = authorId;
            } catch (error) {
              console.log("Error verifying token:", error.message)
              res.status(401).send({message: "error verifying token"})
            }
            const user = await prisma.user.update({
                where: {
                  User_id: user_id
                },
                data: {
                  Name: name
                }
              });
            res.status(200).send({message: "success"})
          } catch (error) {
            console.log(error.message);
            res.status(401).send({ message: error.message});
          }
        } else {
          try {
            try {
              const decodedToken = await admin.auth().verifyIdToken(idToken);
              const authorId = decodedToken.uid;
              var user_id = authorId;
            } catch (error) {
              console.log("Error verifying token:", error.message)
              res.status(401).send({message: "error verifying token"})
            }
            const user = await prisma.user.findUnique({
                where: {
                  User_id: user_id
                },
                select: {
                  Name: true
                }
              });
            res.status(200).send({message: user})
          } catch (error) {
            console.log(error.message);
            res.status(401).send({ message: error.message});
          }
        }
    } else {
        res.status(405).json({ message: 'Wrong type' });
    }
}
export async function GET(request) {
}