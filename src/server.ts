import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Create Server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Configure Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
// Home
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my server');
});

// Upload
app.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file?.path; // Path to the file
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return
    }
    const result = await cloudinary.uploader.upload(file, {
      folder: 'uploads', // Optional: Cloudinary folder
    });
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully!',
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Resources
app.get('/resources', async (req: Request, res: Response) => {
  try {
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'uploads', // Optional: Filter by folder
    });
    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start Server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});