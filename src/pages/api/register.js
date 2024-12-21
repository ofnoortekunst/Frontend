import admin from "./main"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getNameFromEmail(email) {
  if (!email.includes('@')) {
    return null;
  }

  const namePart = email.split('@')[0];
  const name = namePart.replace(/[._]/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default async function POST(req, res) {
    if (req.method === "POST") {
        var { formdata, idToken, darkmode } = req.body;
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid
            if (darkmode == "inactive") {
              darkmode = false
            }
            else {
              darkmode = true
            }
            const userRecord = await admin.auth().updateUser(uid, {
              displayName: formdata['name'],
            });
            console.log(getNameFromEmail(decodedToken.email))
            var user_grade = formdata['school-select']
            if (!user_grade) {
              user_grade = "muu"
            }
            const existingUser = await prisma.user.findUnique({
              where: { User_id: uid },
          });
          if (existingUser) {
            res.status(200).send({ message: "success"});
          }
          else {
            // Create a new user in the database
            const newUser = await prisma.user.create({
              data: {
                  User_id: uid,
                  Grade: user_grade,
                  Language: "et",
                  Name: displayName || getNameFromEmail(decodedToken.email),
                  LightPreference: darkmode,
              },
          });
          res.status(200).send({ message: "success"});
          }
          } catch (error) {
            console.log("Error verifying token:", error.message);
            res.status(401).send({ error: "Unauthorized" });
          }
        
    } else {
        res.status(405).json({ message: 'Registration unsuccessful' });
    }
}