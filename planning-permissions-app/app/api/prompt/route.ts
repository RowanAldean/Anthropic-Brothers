// langchain imports
import { PromptTemplate } from "langchain/prompts";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { formatDocumentsAsString } from "langchain/util/document";
// unrelated imports
import { NextRequest, NextResponse } from "next/server";
import { queryDatabaseForPDFs } from "@/lib/database";


export async function POST(request: NextRequest) {
  // TOOD: Delete this when no longer loading from static files
  // const loader = new PDFLoader(".\\public\\pdfs\\example-planning-doc.pdf", {
  //   splitPages: false,
  // });

  // Create an instance of Langchain with your Anthropi API key
  const model = new ChatAnthropic({
    // temperature: 0,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-2",
  });

  const datadump = await queryDatabaseForPDFs();

  // Prompt Claude 2 using Langchain
  const promptTemplate = PromptTemplate.fromTemplate(
    `Human: <council-rules-collection>{datasource}</council-rules-collection> 
    I want to extend my garage. Do I need planning permission based on the document?

    Skip the preamble and reply to me in the most clear and concise way.

    Based on the limitations you can see and exceptions for planning permission please ask me a series of questions each on a new line to
    qualify if I truly need planning permission.

    Assistant: 
    `
  );

  const chain = promptTemplate.pipe(model);

  const stringDatadump = datadump?.map(doc => doc.content).join('') || ''; //TODO: Have some visibility for if this is null? Will Claude realise?

  const result = await chain.invoke({ datasource: stringDatadump });

  console.log(result);
  // Return the response
  return NextResponse.json("result.content");
}
