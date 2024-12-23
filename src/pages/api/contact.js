import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "./main"
const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'See API endpoint aktsepteerib ainult POST päringuid' });
    }

    const { idToken, contactPreference, contact } = req.body;

    if (!idToken || !contactPreference || !contact) {
        return res.status(400).json({ message: "Puuduvad vajalikud parameetrid" });
    }

    try {
        const { userId } = await authenticateUser(idToken);

        const updatedUser = await prisma.user.update({
            where: {
                User_id: userId
            },
            data: {
                ContactPreference: contactPreference,
                Contact: contact
            }
        });

        return res.status(200).json({ 
            message: "Kontaktandmed edukalt uuendatud",
            user: {
                contactPreference: updatedUser.ContactPreference,
                contact: updatedUser.Contact
            }
        });

    } catch (error) {
        console.log("Error updating contact info:", error);
        return res.status(500).json({ message: "Kontaktandmete uuendamisel tekkis viga" });
    }
} 