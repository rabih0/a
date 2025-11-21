const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// السماح للموقع بالوصول للسيرفر
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // تشغيل ملفات HTML الموجودة في المجلد

// إعداد الذكاء الاصطناعي
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/api/ai', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        // اختيار الموديل
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" });
    }
});

app.listen(port, () => {
    console.log(`🚀 السيرفر يعمل الآن! افتح الرابط التالي: http://localhost:${port}`);
});