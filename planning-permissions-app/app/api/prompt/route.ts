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

  // Prompt Claude 2 using Langchain
  const promptTemplate = PromptTemplate.fromTemplate(
    `
    Human: <council-rules-collection>{datasource}</council-rules-collection>
  
    A user has come to you with the following project:
  
    <users-project-description>{userMessage}</users-project-description>
  
    Recall that your job is to use all data at your disposal. You have been provided with a collection of council rules and supporting documentation.
    Use this as a reference to determine if the project outlined by the user requires planning permission or not considering what council the project will take place in.
  
    You have been asked to provide a series of questions to qualify if they may need planning permission.
  
    Until you have determined whether or not they need permission, ask a single question to them and await a response.
    At any point during the conversation, if you have determined that they do not require planning permission then stop asking questions
    and return the exact term <not-required-term>NO-PERMISSION-REQUIRED</not-required-term>.
    
    If during your process of asking single questions to the user, you determine that they do require planning permission then return the 
    exact term <required-term>PERMISSION-REQUIRED.</required-term>
  
    I as a developer will integrate my code to look for these terms. It is paramount that you use them specifically as described above.
    
    You are an advisor on UK planning permissions for residential and commercial projects. Your primary task
    is to determine if a user needs planning permission or not based on the local council for the area which the project is
    intended to take place. An example is that most home extensions of significant measure need permissions.
  
    You are expected to always be concise and to use the data provided and at your disposal to determine as quickly as possible
    whether a user needs planning permission for the given project they describe to you.

    You should not make any reference to our current discussion in your questioning and speak as though you are talking to the user directly. Do not make small talk and make no reference to the term user. You are now speaking to the user, your next response must be a question.








    Assistant:
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
