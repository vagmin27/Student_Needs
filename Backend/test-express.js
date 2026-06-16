import express from 'express';
import tutorialChatRoutes from './routes/Tutorials/tutorialChatRoutes.js';
const app = express();
app.use('/api/tutorial-chat', tutorialChatRoutes);
app.listen(8081, () => console.log('Test server running on 8081'));
