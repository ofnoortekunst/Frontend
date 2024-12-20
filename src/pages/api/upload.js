import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import admin from "./main"
const mime = require('mime-types');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const crypto = require('crypto');

const prisma = new PrismaClient();

function generateSHA256Hash(base64Image) {
  return new Promise((resolve, reject) => {
    try {
      // Step 1: Convert base64 string to Buffer (remove the data URL prefix if present)
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, ''); // Removes the prefix like "data:image/png;base64,"
      const buffer = Buffer.from(base64Data, 'base64');
  
      // Step 2: Create the SHA-256 hash
      const hash = crypto.createHash('sha256');
      hash.update(buffer);
      
      // Step 3: Get the hexadecimal representation of the hash
      const sha256Hash = hash.digest('hex');
      
      resolve(sha256Hash);
    } catch (err) {
      reject(err);
    }
  });
}

const saveImage = (imageObj, imageData, saveUser, res) => {
  return new Promise(async function(resolve, reject) {
    try {
      const identifier = crypto.randomUUID()
      const filePath = path.join(
        process.cwd(),  // This gives the current working directory (root of the project)
        'public/images/art',
        `${saveUser}`,
      );
      const imagePath = path.join(
        filePath,
        `${identifier}.${mime.extension(imageData.type)}`
      );
      const savePath = ['/art',`${saveUser}`,`${identifier}.${mime.extension(imageData.type)}`].join("/")

      // Extract the base64 data
      const base64Data = imageObj;

      await fs.promises.mkdir(filePath, { recursive: true });

      // Save the file
      await fs.promises.writeFile(imagePath, base64Data, { encoding: 'base64' });
      const [result] = await client.safeSearchDetection(imagePath);
      const detections = result.safeSearchAnnotation;
      if (detections.adult !== 'LIKELY' && detections.adult !== 'VERY_LIKELY' &&
        detections.violence !== 'LIKELY' && detections.violence !== 'VERY_LIKELY') {
        resolve(savePath);
      } else {
        fs.promises.unlink(imagePath)
        res.status(406).send({ message: "Content detected as not acceptable. " + "adult: " + detections.adult + " violence: " + detections.violence + " racy: " + detections.racy});
      }
    } catch (err) {
      reject(err);
    }
  });
};

export default async function POST(req, res) {
    if (req.method === "POST") {
        var { formdata, idToken} = req.body;
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;
            var size = (formdata['sizeCustom']  || formdata['size']).slice(0,25);
            var style = (formdata['technique2'] || formdata['technique']).slice(0,30);

            const imageHash = await generateSHA256Hash(formdata.image)
            const filePath = await saveImage(formdata.image, formdata.imageData, uid, res)
            const newArt = await prisma.art.create({
              data: {
                  AuthorId: uid,
                  Title: (formdata['pealkiri']).slice(0,40),
                  ImageReference: filePath,
                  Description: formdata['tutvustus'],
                  Pind: formdata['surface'],
                  Size: size,
                  Technique: style,
                  Hash: imageHash,
                  Orientation: (formdata['direction']).slice(0,20)
              },
            }).then(prisma.user.update({
              where: {
                User_id: uid,
              },
              data: {
                NumWorks: {
                  increment: 1,
                }
              }
            }))
            console.log(newArt)
            res.status(200).send({ message: "success" });
          } catch (error) {
            console.log(error.message);
            res.status(401).send({ error: "Unauthorized" });
          }
        
    } else {
        res.status(405).json({ message: 'Registration unsuccessful' });
    }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}