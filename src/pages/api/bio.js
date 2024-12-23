import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "./main"

const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ 
            message: 'See API endpoint aktsepteerib ainult POST päringuid' 
        });
    }

    const { idToken, bio } = req.body;

    if (bio) {
        if (!idToken) {
            return res.status(400).json({
                message: 'Bio muutmiseks peate olema sisse logitud'
            });
        }

        try {
            const { userId } = await authenticateUser(idToken);

            if (typeof bio !== 'string' || bio.length > 750) {
                return res.status(400).json({
                    message: 'Bio peab olema tekst ja maksimaalselt 750 tähemärki pikk'
                });
            }

            await prisma.user.update({
                where: {
                    User_id: userId
                },
                data: {
                    Bio: bio
                }
            });
            return res.status(200).json({ 
                message: "Bio edukalt muudetud" 
            });
        } catch (error) {
            console.log(error.message);
            if (error.message.includes('Invalid authentication token')) {
                return res.status(401).json({ 
                    message: "Teie sisselogimise seanss on aegunud. Palun logige uuesti sisse" 
                });
            }
            return res.status(500).json({ 
                message: "Serveri viga. Palun proovige hiljem uuesti" 
            });
        }
    } else {
        const userId = req.body.idToken;
        if (!userId) {
            return res.status(400).json({
                message: 'Kasutaja ID on vajalik'
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                User_id: userId
            },
            select: {
                Bio: true
            }
        });
        return res.status(200).json({ message: user.Bio });
    }
}