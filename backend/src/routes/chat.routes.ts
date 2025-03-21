import { Router } from 'express';
import { ChatService } from '../services/chat.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const chatService = new ChatService();

router.use(authMiddleware);

router.post('/send', async (req, res, next) => {
    try {
        const { content } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User ID is required');
        }
        const response = await chatService.sendMessage(userId, content);
        res.json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/history', async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User ID is required');
        }
        const history = await chatService.getChatHistory(userId);
        res.json(history);
    } catch (error) {
        next(error);
    }
});

export default router;