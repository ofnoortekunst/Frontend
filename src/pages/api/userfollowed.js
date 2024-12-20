import { PrismaClient } from '@prisma/client'
import admin from "./main"

const prisma = new PrismaClient()
async function followUser(currentUserId, userToFollowId) {
    // Check if the current user is already following the target user
    const alreadyFollowing = await prisma.user.findUnique({
        where: { User_id: currentUserId },
        select: { following: { where: { User_id: userToFollowId } } },
    });
    
    // If already following, do nothing
    if (alreadyFollowing.following.length > 0) {
        await prisma.user.update({
            where: { User_id: userToFollowId },
            data: {
                followers: {
                disconnect: { User_id: currentUserId },
                },
            },
            });
        res.status(200).send({message: 'unfollowed'})
    }
    
    // Otherwise, follow the user (add to both following and followers relations)
    await prisma.user.update({
        where: { User_id: currentUserId },
        data: {
        following: {
            connect: { User_id: userToFollowId },
        },
        },
    });

    
    res.status(200).send({message: 'followed'})
    }

export default async function POST(req, res) {
    if (req.method === "POST") {
        var { idToken, post, reason} = req.body;
        const id = post
        try {
            if (idToken == 'visitor') {
                res.status(200).send({message: 'visitor'})
            } else {
                try {
                    const decodedToken = await admin.auth().verifyIdToken(idToken);
                    const authorId = decodedToken.uid;
                    var user_id = authorId;
                } catch (error) {
                    console.log("Error verifying token:", error.message)
                }
            }
            if (reason == "get_following") {
                const following = await prisma.user.findUnique({
                    where: {
                    User_id: user_id
                    },
                    include: {
                        following: {   
                            select: {
                                id: true,
                                User_id: true
                            }
                        }
                    }
                });
                
                // Check if the user has already liked the artwork
                res.status(200).send({message: following})
            }else if (reason == "get_followers") {
                const followers = await prisma.user.findUnique({
                    where: {
                    User_id: user_id
                    },
                    include: {
                        followers: {   
                            select: {
                                id: true,
                                User_id: true
                            }
                        }
                    }
                });
                
                // Check if the user has already liked the artwork
                res.status(200).send({message: followers})
            } else {
                followUser(user_id, reason)
            }
          } catch (error) {
            console.log(error.message);
            res.status(401).send({ message: error.message});
          }
    } else {
        res.status(405).json({ message: 'Wrong type' });
    }
}