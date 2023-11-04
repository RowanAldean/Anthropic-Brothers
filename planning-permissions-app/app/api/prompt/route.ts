import { PromptTemplate } from "langchain/prompts";
import { NextRequest, NextResponse } from "next/server";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { formatDocumentsAsString } from "langchain/util/document";

export async function POST(request: NextRequest) {
  const loader = new PDFLoader(".\\public\\pdfs\\example-planning-doc.pdf", {
    splitPages: false,
  });

  // Create an instance of Langchain with your Anthropi API key
  const model = new ChatAnthropic({
    // temperature: 0,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-2",
  });

  // Prompt Claude 2 using Langchain
  const promptTemplate = PromptTemplate.fromTemplate(
    `Human: <doc>{document}</doc> 
    I want to extend my garage. Do I need planning permission based on the document?

    Skip the preamble and reply to me in the most clear and concise way.

    Based on the limitations you can see and exceptions for planning permission please ask me a series of questions each on a new line to
    qualify if I truly need planning permission.

    Assistant: 
    `
  );

  const chain = promptTemplate.pipe(model);

  const docs = await loader.load();

  const docsString = formatDocumentsAsString(docs);

  const result = await chain.invoke({ document: docsString });

  console.log(result);
  // Return the response
  return NextResponse.json(result.content);
}
