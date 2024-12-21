import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "./main"

const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ 
            message: 'See API endpoint aktsepteerib ainult POST päringuid' 
        });
    }

    const { idToken, name } = req.body;

    if (!idToken) {
        return res.status(400).json({
            message: 'Nime muutmiseks peate olema sisse logitud'
        });
    }

    try {
        const { userId } = await authenticateUser(idToken);

        if (name) {
            if (typeof name !== 'string' || name.length > 50) {
                return res.status(400).json({
                    message: 'Nimi peab olema tekst ja maksimaalselt 50 tähemärki pikk'
                });
            }

            await prisma.user.update({
                where: {
                    User_id: userId
                },
                data: {
                    Name: name
                }
            });
            return res.status(200).json({ 
                message: "Nimi edukalt muudetud" 
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                User_id: userId
            },
            select: {
                Name: true
            }
        });
        return res.status(200).json({ message: user });

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

export async function GET(request) {
}