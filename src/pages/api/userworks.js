import { PrismaClient } from '@prisma/client'
import admin from "./main"

const prisma = new PrismaClient()


export default async function POST(req, res) {
    if (req.method === "POST") {
        var { idToken, works} = req.body;
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const user_id = decodedToken.uid
            if (works == "count") {
                try {
                    const countWork = await prisma.art.count({
                        where: {
                            AuthorId: user_id,
                        },
                    });
                    res.status(200).send({ message: countWork });
                  } catch (error) {
                    console.log(error)
                    res.status(500).send({ error: "Not Found" });
                  }
            } else if (works == "get") {
                try {
                    const countWork = await prisma.art.count({
                        where: {
                            AuthorId: user_id,
                        },
                        select: {
                            Works: true
                        }
                    });
                    res.status(200).send({ message: countWork });
                  } catch (error) {
                    console.log(error)
                    res.status(500).send({ error: "Not Found" });
                  }
            } else if (works == "all") {
                try {
                    const userWorks = await prisma.user.findUnique({
                        where: {
                          User_id: user_id,  // Replace 'user_id_value' with the actual user ID you want to query
                        },
                        select: {
                          Works: {
                            select: {
                              ImageReference: true,  // Select only the ImageReference field from the user's works
                            },
                          },
                        },
                      });
                      
                      const imageReferences = userWorks?.Works.map(work => 
                        work.ImageReference.split("public")[1].replace(/\\/g, '/')
                      ) || [];
                    res.status(200).send({ message: imageReferences });
                  } catch (error) {
                    console.log(error)
                    res.status(500).send({ error: "Not Found" });
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