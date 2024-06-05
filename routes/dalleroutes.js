import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();


const openai = new OpenAI({apiKey:process.env.DALLE_API_KEY});

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E');
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const aiResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: '1024x1024', // Ensure the size is correctly formatted
            response_format: 'b64_json',
        });
        const image = aiResponse.data[0].b64_json;
        res.status(200).json({ photo: image });
    } catch (error) {
        console.error('Error creating image:', error);

        if (error.response) {
            console.error('OpenAI API Error:', error.response.data);
            res.status(error.response.status).json({ message: error.response.data.error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

export default router;
