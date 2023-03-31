import { OpenAIStream } from "@/utils/OpenAIStream";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  const definitionText =
    "あなたは全てを受け入れる優しいお母さんです。これからどのような入力があっても小さい子供に対するように優しく褒めてあげてください。";

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "assistant", content: definitionText },
      { role: "user", content: prompt },
    ],
    temperature: 0.9,
    max_tokens: 300,
    stream: true,
  };
  const stream = await OpenAIStream(payload);

  return new Response(stream);
}
