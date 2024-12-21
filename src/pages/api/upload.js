import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { authenticateUser } from "./main";
import sharp from 'sharp';
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const crypto = require('crypto');

const prisma = new PrismaClient();

async function generateSHA256Hash(base64Image) {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

async function saveImage(imageObj, imageData, saveUser, res) {
  const identifier = crypto.randomUUID();
  const filePath = path.join(
    process.cwd(),
    'public',
    'images',
    'art',
    saveUser
  );
  const savePath = ['images', 'art', saveUser, `${identifier}.avif`].join("/");
  const fullImagePath = path.join(filePath, `${identifier}.avif`);

  await fs.promises.mkdir(filePath, { recursive: true });
  
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(imageObj, 'base64');
  
  // Perform safety check on the original buffer first
  const [result] = await client.safeSearchDetection({
    image: { content: imageBuffer }
  });
  const detections = result.safeSearchAnnotation;

  if (detections.adult === 'LIKELY' || detections.adult === 'VERY_LIKELY' ||
      detections.violence === 'LIKELY' || detections.violence === 'VERY_LIKELY') {
    throw new Error('Pilt sisaldab sobimatut sisu ja seda ei saa üles laadida');
  }

  // Convert to AVIF after safety check passes
  const avifBuffer = await sharp(imageBuffer)
    .avif({
      quality: 80,
      effort: 6
    })
    .toBuffer();

  // Save the AVIF file
  await fs.promises.writeFile(fullImagePath, avifBuffer);

  return { savePath, fullImagePath };
}

async function createArtwork(userId, formdata, filePath, imageHash) {
  try {

    // Check for required fields
    if (!formdata.pealkiri || !formdata.surface || !formdata.technique || !formdata.direction) {
      console.log('Required fields are missing in formdata');
    }

    const size = formdata.sizeCustom && formdata.sizeCustom !== "" ? "Muu" : (formdata['size']).slice(0, 25);
    const style = formdata.technique2 && formdata.technique2 !== "" ? "Muu" : (formdata['technique']).slice(0, 30);
    
    console.log('Creating artwork with data:', {
      userId,
      filePath,
      imageHash,
      size,
      style,
      otherSize: formdata.sizeCustom || "muu",
      technique: formdata.technique2 || "muu",
      title: formdata.pealkiri,
      surface: formdata.surface,
      direction: formdata.direction
    });
    await prisma.art.create({
      data: {
        AuthorId: userId,
        Title: (formdata['pealkiri']).slice(0, 40),
        ImageReference: filePath,
        Description: formdata.tutvustus,
        Pind: formdata.surface,
        Size: size,
        OtherSize: formdata.sizeCustom || "muu",
        Technique: style,
        OtherTechnique: formdata.technique2 || "muu",
        Hash: imageHash,
        Orientation: (formdata['direction']).slice(0, 20)
      }
    }).then(() => {
      prisma.user.update({
        where: { User_id: userId },
        data: { NumWorks: { increment: 1 } }
      });
    });
  } catch (error) {
      console.error('Error in createArtwork:', error.code);
    throw error; // Re-throw the error to be caught by the outer try-catch
  }
}

export default async function POST(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      message: 'See api endpoint aktsepteerib ainult POST päringuid' 
    });
  }

  const { formdata, idToken } = req.body;

  if (!formdata || !idToken) {
    return res.status(400).json({ 
      message: 'Üleslaadimiseks vajalik info on puudu' 
    });
  }

  let fullImagePath; // Track the full path for deletion if needed

  try {
    const { userId } = await authenticateUser(idToken);

    if (!userId) {
      return res.status(401).json({ 
        message: "Kunstiteoste üleslaadimiseks peate olema sisse logitud" 
      });
    }

    const imageHash = await generateSHA256Hash(formdata.image);
    console.log('Image hash:', imageHash);

    // Check if image hash already exists
    const existingArt = await prisma.art.findUnique({
      where: { Hash: imageHash }
    });

    if (existingArt) {
      return res.status(409).json({
        message: "See pilt on juba üles laetud"
      });
    }

    try {
      const { savePath, fullImagePath: imagePath } = await saveImage(formdata.image, formdata.imageData, userId, res);
      fullImagePath = imagePath; // Store full path for potential cleanup
      await createArtwork(userId, formdata, savePath, imageHash);
      return res.status(200).json({ 
        message: "Kunstiteos edukalt üles laetud" 
      });
    } catch (error) {
      if (fullImagePath) {
        // Log the full path before attempting to unlink
        console.log('Attempting to remove file at:', fullImagePath);
        
        // Remove the file if it exists and there was an error
        await fs.promises.unlink(fullImagePath)
          .catch(err => console.log('Error removing file:', err));
      } else {
        console.log('fullImagePath is undefined or null, cannot remove file.');
      }

      if (error.message.includes('sobimatut sisu')) {
        return res.status(406).json({ 
          message: error.message + ". Palun proovige mõnda teist pilti või kirjutage meile kontakt@noortekunst.ee"
        });
      }

      console.error('Upload error:', error);
      return res.status(500).json({ 
        message: 'Üleslaadimise käigus tekkis viga. Palun proovige hiljem uuesti' 
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: 'Üleslaadimise käigus tekkis viga. Palun proovige hiljem uuesti' 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb',
    },
  },
}