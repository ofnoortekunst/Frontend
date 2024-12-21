import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "./main"

const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ 
            message: 'See API endpoint aktsepteerib ainult POST päringuid' 
        });
    }

    const { idToken, grade } = req.body;

    if (!idToken) {
        return res.status(400).json({
            message: 'Kooliastme muutmiseks peate olema sisse logitud'
        });
    }

    try {
        const { userId } = await authenticateUser(idToken);

        if (!grade) {
            return res.status(400).json({
                message: 'Kooliastme väärtus on puudu'
            });
        }

        if (grade === "get") {
            const user = await prisma.user.findUnique({
                where: {
                    User_id: userId
                },
                select: {
                    Grade: true
                }
            });
            return res.status(200).json({ message: user.Grade });
        }

        await prisma.user.update({
            where: {
                User_id: userId
            },
            data: {
                Grade: grade
            }
        });

        return res.status(200).json({ message: grade });

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
}