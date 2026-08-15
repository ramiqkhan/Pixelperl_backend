import express from 'express';
import quoteController from '../controllers/quoteController.js';

const router = express.Router();

router.post('/', quoteController.createQuote);

export default router;