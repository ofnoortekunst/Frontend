import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const MAX_CACHE_SIZE = 100; // Maximum number of items in cache
const CACHE_EXPIRATION_TIME = 1000 * 60 * 5; // 5 minutes in milliseconds

class LRUCache {
  constructor(maxSize, expirationTime) {
    this.maxSize = maxSize;
    this.expirationTime = expirationTime;
    this.cache = new Map();
  }

  set(key, value) {
    const now = Date.now();
    if (this.cache.has(key)) {
      this.cache.delete(key); // Remove existing entry
    } else if (this.cache.size >= this.maxSize) {
      // Remove the oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: now });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.expirationTime) {
      this.cache.delete(key); // Remove expired entry
      return null;
    }

    // Move the accessed entry to the end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }
}

const cache = new LRUCache(MAX_CACHE_SIZE, CACHE_EXPIRATION_TIME); // In-memory cache

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for GET requests
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') { // Change to GET method
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, width, height } = req.query; // Use req.query for GET parameters
    const start = performance.now();
    if (!imageUrl || !width || !height) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Construct the cache key
    const cacheKey = `${imageUrl}-${width}-${height}`;
    if (cache.has(cacheKey)) {
      // Serve from cache
      return res.setHeader('Content-Type', 'image/avif').status(200).send(cache.get(cacheKey));
    }

    // Construct the file path from the imageUrl
    const imagePath = path.join(process.cwd(), 'public', 'images', imageUrl);

    // Read the image file from the filesystem
    const imageBuffer = await fs.promises.readFile(imagePath).catch(() => {
      return res.status(404).json({ error: 'Image not found' });
    });

    // Process image with sharp
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(parseInt(width), parseInt(height), {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer(); // No need to specify format as all images are assumed to be AVIF

    // Store the processed image in cache
    cache.set(cacheKey, resizedImageBuffer);

    const end = performance.now();
    console.log(`Image processing took ${end - start} milliseconds`);

    // Set the content type and send the image buffer
    res.setHeader('Content-Type', 'image/avif');
    res.status(200).send(resizedImageBuffer);

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
} 