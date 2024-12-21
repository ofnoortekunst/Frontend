import { PrismaClient } from '@prisma/client'
import admin from "./main"
const prisma = new PrismaClient()

export default async function POST(req, res) {
    if (req.method === "POST") {
        var { idToken, works, id, sort, start, end, full} = req.body;
        try {
          let user_id = '';
          if (!full) {
            var full = false
          }
          if (!id) {
            id = {}
          }
          if (idToken && idToken != "visitor") {
            try {
              const decodedToken = await admin.auth().verifyIdToken(idToken);
              const authorId = decodedToken.uid;
              user_id = authorId;
            } catch (error) {
              console.log("Error verifying token:", error.message)
            }
          }
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
            } else if (works) {
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
                                select: {
                                  User_id: true,
                                  },
                              },
                              LikedBy: {
                                select: {
                                  User_id: true,
                                  },
                              },
                            },
                          },
                        },
                      });
                      var imageReferences = await Promise.all(
                        userWorks.flatMap(user => 
                          (user['Works'] || []).map(async work => ({
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
                            liked: work.LikedBy.some(favoriter => favoriter.User_id === user_id),
                          }))
                        ).slice(start, end)
                      );
                    res.status(200).send({ message: imageReferences });
                  } catch (error) {
                    console.log(error)
                    res.status(500).send({ error: "Not Found" });
                  }
            }
          } catch (error) {
            console.log(error.message);
            res.status(401).send({ message: error.message});
          }
    } else {
        res.status(405).json({ message: 'Wrong type' });
    }
}