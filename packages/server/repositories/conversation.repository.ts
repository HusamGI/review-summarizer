//#region Implementation details

// In a real scenario this conversation map should be saved in the database
const conversations = new Map<string, string>();

//#endregion

//#region Public interface

export const conversationRepository = {
  getLastResponseId: (conversationId: string): string | undefined =>
    conversations.get(conversationId) ?? undefined,

  setLastResponseId: (conversationId: string, responseId: string) =>
    conversations.set(conversationId, responseId),
};

//#endregion
