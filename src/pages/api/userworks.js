import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "./main"
const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'See API endpoint aktsepteerib ainult POST päringuid' });
    }
    const { idToken, works, id = {}, sort, start, end, full = false } = req.body;
    let user_id = '';
    if (idToken && idToken !== "visitor") {
        try {
            const { userId } = await authenticateUser(idToken);
            user_id = userId;
        } catch (error) {
            console.log("Error verifying token:", error.message);
        }
    }

    try {
        if (works === "count") {
            try {
                const countWork = await prisma.art.count({
                    where: { AuthorId: user_id }
                });
                return res.status(200).json({ message: countWork });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Teoste arvu leidmisel tekkis viga" });
            }
        }

        if (!works) {
            return res.status(400).json({ message: "Puuduvad vajalikud parameetrid" });
        }

        try {
            const userWorks = await prisma.user.findMany({
                take: end,
                where: works,
                select: {
                    Name: true,
                    Works: {
                        where: id,
                        orderBy: sort,
                        select: {
                            ImageReference: true,
                            AuthorId: true,
                            Likes: true,
                            Title: true,
                            Size: true,
                            Id: true,
                            Technique: true,
                            Pind: true,
                            Year: true,
                            Orientation: full,
                            Description: full,
                            UploadDate: full,
                            UpdateDate: full,
                            FavouritedBy: {
                                select: { User_id: true }
                            },
                            LikedBy: {
                                select: { User_id: true }
                            }
                        }
                    }
                }
            });

            const imageReferences = await Promise.all(
                userWorks.flatMap(user => 
                    (user.Works || []).map(work => ({
                        imageReference: work.ImageReference,
                        authorId: work.AuthorId,
                        likes: work.Likes,
                        title: work.Title,
                        name: user.Name,
                        contact: user.Contact || "",
                        contactType: user.ContactPreference || "",
                        size: work.Size,
                        surface: work.Pind,
                        id: work.Id,
                        technique: work.Technique,
                        year: work.Year,
                        description: work.Description || "",
                        direction: work.Orientation || "",
                        uploadDate: work.UploadDate || "",
                        updateDate: work.UpdateDate || "",
                        favorite: work.FavouritedBy.some(favoriter => favoriter.User_id === user_id),
                        liked: work.LikedBy.some(liker => liker.User_id === user_id)
                    }))
                ).slice(start, end)
            );

            return res.status(200).json({ message: imageReferences });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Teoste leidmisel tekkis viga" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: error.message });
    }
}