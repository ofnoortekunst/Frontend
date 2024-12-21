import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "./main"

const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'Wrong type' });
    }

    const { idToken, post: id } = req.body;

    try {
        const { userId } = await authenticateUser(idToken);
        
        const art = await prisma.art.findUnique({
            where: { Id: id },
            include: { LikedBy: true }
        });
        
        const hasLiked = art?.LikedBy.some(user => user.User_id === userId);
        
        await prisma.art.update({
            where: { Id: id },
            data: {
                Likes: {
                    [hasLiked ? 'decrement' : 'increment']: 1
                },
                LikedBy: {
                    [hasLiked ? 'disconnect' : 'connect']: {
                        User_id: userId
                    }
                }
            }
        });
        
        return res.status(200).send({
            message: hasLiked ? "removed" : "added"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(401).send({ message: error.message });
    }
}