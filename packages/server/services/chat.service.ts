import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { ConversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';

//#region Implementation details

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
  'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

//#endregion

//#region Public interface

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions,
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 200,
      previous_response_id:
        ConversationRepository.getLastResponseId(conversationId),
    });

    ConversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};

//#endregion
