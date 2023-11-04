import { PromptTemplate } from "langchain/prompts";
import { NextRequest, NextResponse } from "next/server";
import { ChatAnthropic } from "langchain/chat_models/anthropic"; // Assuming you have installed the Langchain package

export async function POST(request: NextRequest) {
  // Create an instance of Langchain with your Anthropi API key
  const model = new ChatAnthropic({
    // temperature: 0,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: 'claude-2'
  });

  // Prompt Claude 2 using Langchain
  const promptTemplate = PromptTemplate.fromTemplate(
    `Human: <doc>{document}</doc> 
    Please summarise the rules around planning permissions from this UK council government document.
    Assistant: Sure, in order to get planning permission you will
    `
  );

  const chain = promptTemplate.pipe(model);

  const result = await chain.invoke({document: `Hi i'm the council`});

  console.log(result);
  // Return the response
  return NextResponse.json(result.content);
}

export default POST;
