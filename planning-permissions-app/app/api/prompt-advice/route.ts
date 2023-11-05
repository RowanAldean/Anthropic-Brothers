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
  const usersProjectMessage = usersProjectJson.promptMessage;
  console.log(JSON.stringify(usersProjectJson));
  // Prompt Claude 2 using Langchain
  const promptTemplate = PromptTemplate.fromTemplate(
    `
    Human: <council-rules-collection>{datasource}</council-rules-collection>
  
    A user has come to you with the following project:
  
    <users-project-description>{userMessage}</users-project-description>
  
    You are an advisor on UK planning permissions for residential and commercial projects. Your primary task
    is to determine if a user needs planning permission or not based on the local council for the area which the project is
    intended to take place. An example is that most home extensions of significant measure need permissions.

    You must give best practice advice on a planning permission application wrapped in the xml tags as follows
    <top-tips>Your bulleted list of advice here</top-tips>

    You must then give pointers on what to avoid wrapped in xml tags as follows
    <red-flags>Your bulleted list of advice here</red-flags>

    I as a developer will parse this to show on my application. Please do not confirm, I have been very clear. Your next response
    is expected to be the aforementioned bulleted lists.

    Skip any preamble, repeat the county mentioned in the userMessage and then immediately show the tags exactly.
  
    Assistant: Sure here are <top-tips></top-tips> and <red-flags></red-flags>
    `
  );
  const chain = promptTemplate.pipe(model);
  const stringDatadump = datadump?.map((doc) => doc.content).join("") || ""; //TODO: Have some visibility for if this is null? Will Claude realise?
  const result = await chain.invoke({
    datasource: stringDatadump,
    userMessage: usersProjectMessage,
  });
  // console.log(result);
  // Return the response
  return NextResponse.json(result.content);
}