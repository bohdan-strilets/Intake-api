export type CreateAiLogInput = {
  userId: string;
  inputText: string;
  model: string;
  success: boolean;
  error?: string;
};
