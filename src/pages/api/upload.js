import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import admin from "./main"

const prisma = new PrismaClient();

const saveImage = (imageObj, saveUser) => {
  // Define the path where the image will be saved
  const filePath = path.join(`/public/images/${saveUser}/${imageObj.name}.${imageObj.format}`);

  // Extract the base64 data (remove metadata if present)
  const base64Data = imageObj.data.split(';base64,').pop();

  // Save the file
  fs.writeFile(filePath, base64Data, { encoding: 'base64' }, (err) => {
    if (err) {
      console.error('Error saving image:', err);
    } else {
      console.log('Image saved successfully at:', filePath);
    }
  });
  return filePath
};

export default async function POST(req, res) {
    if (req.method === "POST") {
        var { formdata, idToken, imageData } = req.body;
        try {
            console.log(imageData)
            console.log(idToken)
            console.log(formdata)
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;
            var size = formdata['size']
            if (formdata['sizeCustom']) {
              size = formdata['sizeCustom']
            }
            const filePath = saveImage(imageData, uid)
            // Create a new user in the database
            const newArt = await prisma.user.create({
              data: {
                  AuthorId: uid,
                  Title: formdata['pealkiri'],
                  ImageReference: filePath,
                  Description: formdata['tutvustus'],
                  Size: size,
                  Price: formdata['Price'],
                  Orientation: formdata['direction']
              },
            });
            console.log(newArt)
            res.status(200).send({ message: "success" });
          } catch (error) {
            console.log("Error verifying token:", error.message);
            res.status(401).send({ error: "Unauthorized" });
          }
        
    } else {
        res.status(405).json({ message: 'Registration unsuccessful' });
    }
}