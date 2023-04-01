import { OpenAIStream } from "@/utils/OpenAIStream";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  // const definitionText =
  //   "あなたは全てを受け入れる優しいお母さんです。これからどのような入力があっても小さい子供に対するように優しく褒めてあげてください。";

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  return new Response(stream);
}
