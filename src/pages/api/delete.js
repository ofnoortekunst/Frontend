import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getUserClaims } from './main';

const prisma = new PrismaClient()

async function getArtworkDetails(artworkId) {
    return await prisma.art.findUnique({
        where: { Id: artworkId },
        select: { ImageReference: true },
    });
}

async function deleteArtworkFromDB(artworkId) {
    return await prisma.art.delete({
        where: { Id: artworkId },
    });
}

async function deleteArtworkFromFileSystem(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export default async function POST(req, res) {
    const { idToken, artworkId } = req.body;
    try {
        const admin = await getUserClaims(idToken);
        // Check if the user has admin privileges
        if (admin == true) {
            try {
                const artwork = await getArtworkDetails(artworkId);
                if (!artwork) {
                    return res.status(404).json({ error: 'Teost ei leitud' });
                }

                await deleteArtworkFromDB(artworkId);
                await deleteArtworkFromFileSystem(path.join(process.cwd(), 'public', artwork.ImageReference));
                res.status(200).json({ message: 'Teose edukalt kustutatud' });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Teose kustutamisel tekkis viga' });
            }
        } else {
            res.status(403).json({ error: 'Kasutaja pole admin' });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Autentimis viga' });
    }
}
