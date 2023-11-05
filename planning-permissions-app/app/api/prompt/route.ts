// langchain imports
import { PromptTemplate } from "langchain/prompts";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { formatDocumentsAsString } from "langchain/util/document";


// unrelated imports
import { NextRequest, NextResponse } from "next/server";
import { queryDatabaseForPDFs } from "@/lib/database";

// export const runtime = 'edge'

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

  const usersProjectJson = await request.json();
  const usersProjectMessage = usersProjectJson.messageQuery;

  // TODO: The chaining needs to be done

  // Prompt Claude 2 using Langchain
  const promptTemplate = PromptTemplate.fromTemplate(
    `Human: <council-rules-collection>{datasource}</council-rules-collection> 
    
    You are an advisor on UK planning permissions for construction projects. You have been provided with a large datasource of rules for each council.
    A client of yours has asked you about the following project they plan on undertaking:

    <potential-project>{userMessage}</potential-project>

    Considering what council they fall within based on the area of their home, you have been asked to provide a series of questions
    to qualify if they may need planning permission.
    
    Skip the preamble and reply to them in the most clear and concise way, using the council rules to establish if they even need permission in the least number of questions.

    Assistant: For the project request {userMessage} I'll need to know...
    `
  );

  const chain = promptTemplate.pipe(model);

  const stringDatadump = datadump?.map(doc => doc.content).join('') || ''; //TODO: Have some visibility for if this is null? Will Claude realise?

  const result = await chain.invoke({ datasource: stringDatadump, userMessage: usersProjectMessage });

  // console.log(result);
  // Return the response
  return NextResponse.json(result.content);
}
