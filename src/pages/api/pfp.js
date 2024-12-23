import fs from 'fs';
import path from 'path';
import { authenticateUser } from "./main"; // Ensure this import is correct
import sharp from 'sharp';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function saveProfilePicture(imageObj, userId) {
  const identifier = userId; // Use userId as the identifier for the profile picture
  const filePath = path.join(process.cwd(), 'public', 'images', 'pfp');
  const fullImagePath = path.join(filePath, `${identifier}.avif`);

  await fs.promises.mkdir(filePath, { recursive: true });

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(imageObj, 'base64');

  // Resize the image to 120x120 pixels and convert to AVIF
  const avifBuffer = await sharp(imageBuffer)
    .resize(120, 120) // Resize to 120x120 pixels
    .avif({
      quality: 80,
      effort: 6
    })
    .toBuffer();

  // Save the AVIF file
  await fs.promises.writeFile(fullImagePath, avifBuffer);

  return fullImagePath;
}

export default async function POST(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      message: 'See api endpoint aktsepteerib ainult POST päringuid' 
    });
  }

  const { idToken, image } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Puudub vajalik info' });
  }

  const { userId } = await authenticateUser(idToken);

  if (!userId) {
    return res.status(401).json({ message: "Kasutaja pole autentifitseeritud" });
  }

  if (!image) {
    const filePath = path.join(process.cwd(), 'public', 'images', 'pfp', `${userId}.avif`);
    const exists = await fs.promises.access(filePath).then(() => true).catch(() => false);
    return res.status(200).json({ hasPfp: exists });
  }

  try {
    const fullImagePath = await saveProfilePicture(image, userId);
    return res.status(200).json({ message: "Profiilipilt edukalt üles laetud", path: fullImagePath });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return res.status(500).json({ message: 'Üleslaadimise käigus tekkis viga. Palun proovige hiljem uuesti' });
  }
}
