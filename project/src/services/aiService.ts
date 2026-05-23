import { HealthData, ChatMessage, HealthSuggestion } from '../types/health';

export class AIHealthService {
  private chatHistory: ChatMessage[] = [];

  async processHealthData(data: HealthData): Promise<HealthSuggestion[]> {
    try {
      const response = await fetch("https://ai-powered-api-dgnb.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: `
          Analyze these symptoms:
          Name: ${data.name}
          Age: ${data.age}
          Gender: ${data.gender}
          Symptoms: ${data.symptoms.join(", ")}
          Severity: ${data.severity}
          Duration: ${data.duration}
          Description: ${data.description}
          `,
        }),
      });

      const result = await response.json();

      return [
        {
          condition: "AI Health Assessment",
          likelihood: "medium",
          description: result.botReply,
          recommendations: [
            "Consult a healthcare professional if symptoms worsen",
            "Stay hydrated and get proper rest",
            "Monitor symptoms carefully",
          ],
          urgency: "low",
        },
      ];

    } catch (error) {
      console.error("Error processing health data:", error);

      return [
        {
          condition: "Unable to Analyze",
          likelihood: "low",
          description:
            "AI service is temporarily unavailable.",
          recommendations: [
            "Please try again later",
            "Consult a healthcare provider if needed",
          ],
          urgency: "low",
        },
      ];
    }
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      // Save user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        text: message,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      };

      this.chatHistory.push(userMessage);

      // SEND TO BACKEND
      const response = await fetch("https://ai-powered-api-dgnb.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: message,
        }),
      });

      const data = await response.json();

      // AI RESPONSE
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: data.botReply,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      this.chatHistory.push(aiMessage);

      return aiMessage;

    } catch (error) {
      console.error("Error sending message:", error);

      const fallbackMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: "Unable to connect to AI service right now.",
        sender: "ai",
        timestamp: new Date(),
        type: "warning",
      };

      return fallbackMessage;
    }
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  clearHistory(): void {
    this.chatHistory = [];
  }
}

export const aiService = new AIHealthService();
