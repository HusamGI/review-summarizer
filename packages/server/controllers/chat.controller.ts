import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

//#region Implementation details

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

//#endregion

//#region Public interface

export const chatController = {
  async sendMessage(request: Request, response: Response) {
    const validation = chatSchema.safeParse(request.body);

    if (!validation.success) {
      response.status(400).json(validation.error.format());
      return;
    }

    try {
      const { prompt, conversationId } = request.body;

      const chatResponse = await chatService.sendMessage(
        prompt,
        conversationId
      );

      response.json({ message: chatResponse.message });
    } catch (error) {
      response.status(500).json({ error: 'Failed to generate a response' });
    }
  },
};

//#endregion
