import admin from "./main"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export default async function POST(req, res) {
    if (req.method === "POST") {
        var { idToken, grade} = req.body;
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const user_id = decodedToken.uid
            console.log(user_id)
            if (grade) {
                if (grade == "get") {
                    try {
                        const user = await prisma.user.findUnique({
                            where: {
                            User_id: user_id,
                            },
                            select: {
                            Grade: true,
                            },
                        });
                        res.status(200).send({message: user.Grade})
                    } catch (error) {
                        res.status(500).send({ error: "Not Found" });
                    }
                } else {
                    try {
                        const updatedUser = await prisma.user.update({
                          where: {
                            User_id: user_id,
                          },
                          data: {
                            Grade: grade,
                          },
                          select: {
                            User_id: true,
                            Grade: true,
                          },
                        });
                    
                        res.status(200).send({ message: grade });
                      } catch (error) {
                        res.status(500).send({ error: "Not Found" });
                      }
                }
            }
          } catch (error) {
            console.log("Error verifying token:", error.message);
            res.status(401).send({ error: "Unauthorized" });
          }
    } else {
        res.status(405).json({ message: 'Wrong type' });
    }
}