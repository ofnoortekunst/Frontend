import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "./main"

const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'Wrong type' });
    }

    const { idToken, id } = req.body;
    
    try {
        const { userId } = await authenticateUser(idToken);
        
        const art = await prisma.art.findUnique({
            where: { Id: id },
            include: { FavouritedBy: true }
        });

        if (!art) {
            return res.status(404).send({ message: "Artwork not found" });
        }

        const hasLiked = art.FavouritedBy.some(user => user.User_id === userId);
        
        const updateData = {
            where: { Id: id },
            data: {
                Likes: {
                    [hasLiked ? 'decrement' : 'increment']: 1
                },
                FavouritedBy: {
                    [hasLiked ? 'disconnect' : 'connect']: {
                        User_id: userId
                    }
                }
            }
        };

        await prisma.art.update(updateData);
        
        return res.status(200).send({
            message: hasLiked ? "removed" : "added"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
    }
}