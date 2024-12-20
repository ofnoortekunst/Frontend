import { PrismaClient } from '@prisma/client'
import admin from "./main"

const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method === "POST") {
        var { idToken, id} = req.body;
        try {
            try {
              const decodedToken = await admin.auth().verifyIdToken(idToken);
              const authorId = decodedToken.uid;
              var user_id = authorId;
            } catch (error) {
              console.log("Error verifying token:", error.message)
            }
            const art = await prisma.art.findUnique({
                where: {
                  Id: id
                },
                include: {
                  FavouritedBy: true // Include the list of users who liked the artwork
                }
              });
              
              // Check if the user has already liked the artwork
              const hasLiked = art?.FavouritedBy.some(user => user.User_id === user_id);
              
              if (hasLiked) {
                // If the user has already liked the artwork, remove the like (decrement the likes count)
                await prisma.art.update({
                  where: {
                    Id: id
                  },
                  data: {
                    Likes: {
                      decrement: 1 // Decrement the like count
                    },
                    FavouritedBy: {
                      disconnect: {
                        User_id: user_id // Disconnect the user from the LikedBy relation
                      }
                    }
                  }
                });
                res.status(200).send({message: "removed"})
              } else {
                await prisma.art.update({
                  where: {
                    Id: id
                  },
                  data: {
                    Likes: {
                      increment: 1
                    },
                    FavouritedBy: {
                      connect: {
                        User_id: user_id
                      }
                    }
                  }
                });
                res.status(200).send({message: "added"})
              }
          } catch (error) {
            console.log(error.message);
            res.status(401).send({ message: error.message});
          }
    } else {
        res.status(405).json({ message: 'Wrong type' });
    }
}