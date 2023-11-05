"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideArrowBigRight } from "lucide-react";
import { useEffect, useState } from "react";

type Message = {
  role: "assistant" | "human";
  text: string;
};

export default function Home() {
  const [promptOutput, setPromptOutput] = useState<string>("");
  const [claudeResponse, setClaudeResponse] = useState<Message[]>([
    { role: "assistant", text: "How big is the conservatory going to be?" },
    {
      role: "assistant",
      text: "You have qualified for planning for planning permission",
    },
  ]);

  const [messageIndex, setMessageIndex] = useState(0);

  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messageQuery, setMessageQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  async function callBackend(messages: Message[]): Promise<void> {
    console.log(`MESSAGES ARE: ${JSON.stringify(messages)}`);
    //setMessageIndex(messageIndex+1);
    setIsLoading(true);
    const backendResponse = await fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })
      .then((response) => response.json())
      .then((result) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", text: result },
        ]);
        setClaudeResponse([...claudeResponse, result]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initalMessage = urlParams.get("message");
    setMessages([
      ...messages,
      { role: "human", text: initalMessage ? initalMessage : "" },
    ]);
    setMessageQuery(initalMessage ? initalMessage : "");
    
  }, []);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "human") {
      callBackend(messages);
    }
    
    
  }, [messages]);

  function submitMessage(): void {
    const inputElement = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    const userInput = inputElement.value;
    setMessages([...messages, { role: "human", text: userInput }]);
    setUserMessages([...userMessages, userInput]);
    inputElement.value = "";
  }

  return (
    <main className="flex h-full flex-col items-center justify-between pt-4 w-fill">
      <div
        id="logo"
        className="flex flex-col gap-2 self-center md:self-start md:pl-[10px] max-w-5xl w-fill md:w-fit text-2xl md:text-4xl text-accent font-extrabold items-start text-center lg:flex"
      >
        <a href="/">Buildsmart</a>
      </div>
      <div id="chat-window-container" className="flex flex-col w-full h-full">
        <div className="font-extrabold flex w-full pt-4 self-start justify-center text-center text-lg">
          Let's see if you need permissions...
        </div>
        <div
          id="chat-window"
          className="flex flex-col self-center mx-1 my-5 md:my-10 md:mt-2 md:w-[50%] h-auto bg-accent/20 rounded-md"
        >
          <div id="chat-messages" className="flex flex-col">
            {/* <div
              className="pr-2 flex flex-row-reverse self-end w-fit m-3 rounded-md text-black text-lg p-2"
            >
              <div className="h-10 w-10 rounded-full mr-2">
                <Avatar>
                  <AvatarImage src="https://github.com/identicons/test.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2">
                <i className="mr-3 text-right">You</i>
                <div className="pl-2 w-fit mt-0 m-3 rounded-md text-white bg-accent text-lg p-2">
                  {messageQuery}
                </div>
              </div>{" "}
            </div> */}
            
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex px-2 ${
                    message.role === "human" ? "flex-row-reverse self-end" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full mr-2">
                    <Avatar>
                      {message.role === "human" && (
                        <AvatarImage src="https://github.com/identicons/test.png" />
                      )}
                      {message.role === "assistant" && (
                        <AvatarImage src="https://avatars.githubusercontent.com/u/76263028?s=200&v=4" />
                      )}
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-2">
                    {message.role === "human" && (
                      <i className="mr-3 text-right">You</i>
                    )}
                    {message.role === "assistant" && (
                      <i className="ml-3">Buildsmart AI (Claude)</i>
                    )}

                    <div
                      className={`pl-2 w-fit mt-0 m-3 rounded-md text-${
                        message.role === "human" ? "white bg-accent" : "black"
                      } text-lg p-2`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div
                className={`flex px-2`}
              >
                <div className="h-10 w-10 rounded-full mr-2">
                  <Avatar>
                    
                    
                    <AvatarImage src="https://avatars.githubusercontent.com/u/76263028?s=200&v=4" />
                    
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-2">
               
                    <i className="ml-3">Buildsmart AI (Claude)</i>
  

                  <div
                    className={`pl-2 w-fit mt-0 m-3 rounded-md text-black text-lg p-2`}
                  >
                    {"Buildsmart is thinking..."}
                  </div>
                </div>
              </div>
              )}
            </>
          </div>
          <hr></hr>
          <div
            id="chat-input"
            className="flex w-full gap-2 items-center justify-center"
          >
            <Input
              type="text"
              placeholder="Reply to Buildsmart AI here"
              className="w-[100%] bg-muted m-3 mr-0 placeholder:text-secondary/50"
            ></Input>
            <Button
              variant={"secondary"}
              onClick={submitMessage}
              className="m-3 ml-0"
            >
              <LucideArrowBigRight></LucideArrowBigRight>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
