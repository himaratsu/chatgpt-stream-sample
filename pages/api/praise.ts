import { OpenAIStream } from "@/utils/OpenAIStream";
import { NextRequest } from "next/server";

type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { prompt } = (await req.json()) as {
    prompt: string;
  };

  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: `#role
      You are a professional editor. "contents" is given as JSON.
      
      #notes
      - Response must be Japanese
      - "undefined" means that the user has not yet entered any information
      - Set "undefined" to clear fieldValue

      #OutputFormat
      Output text is "[fieldId]fieldValue"
      example is following:
      --------------
      [9fds1S90fd]ここに内容
      [kfgds3fdDa]ここに内容
      [end]
      --------------
      `,
    },
  ];

  messages.push({ role: "user", content: prompt });

  console.log(messages);

  const payload = {
    // model: "gpt-3.5-turbo",
    model: "gpt-4",
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  return new Response(stream);
}
