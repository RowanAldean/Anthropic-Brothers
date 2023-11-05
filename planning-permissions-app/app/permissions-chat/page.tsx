"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideArrowBigRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [promptOutput, setPromptOutput] = useState<string>("");
  const [claudeResponse, setClaudeResponse] = useState<string[]>([]);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function callBackend(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const messageQuery = urlParams.get("message");
    console.log(`MESSAGE QUERY IS: ${messageQuery}`);
    const backendResponse = await fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageQuery }),
    })
      .then((response) => response.json())
      .then((result) => {
        setClaudeResponse([...claudeResponse, result]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    callBackend();
  }, []);

  function submitMessage(): void {
    const inputElement = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    const userInput = inputElement.value;
    setUserMessages([...userMessages, userInput]);
    inputElement.value = "";
  }

  return (
    <main className="flex h-[95dvh] flex-col items-center justify-between pt-4 w-fill">
      <div
        id="logo"
        className="flex flex-col gap-2 self-center md:self-start md:pl-[10px] max-w-5xl w-fill md:w-fit text-2xl md:text-4xl text-accent font-extrabold items-start text-center lg:flex"
      >
        <a href="/">Buildsmart</a>
      </div>
      <div id="chat-window-container" className="flex flex-col w-full h-full">
        <div
          id="chat-window"
          className="flex flex-col self-center mx-1 my-5 md:my-10 md:w-[50%] h-auto bg-accent/20 rounded-md"
        >
          <div className="font-extrabold flex w-full py-4 self-start justify-center text-center text-lg">
            Do you even need permissions?
          </div>
          <div id="chat-messages" className="flex flex-col">
            {isLoading ? (
              <div className="flex px-2 items-center mb-4">
                <div className="h-10 w-10 rounded-full mr-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <i className="ml-3">Buildsmart AI (Claude) is typing...</i>
                  {/* <div className="pl-2 bg-white w-fit mt-0 m-3 rounded-md text-black text-lg p-2">
                    <Skeleton className="h-8 w-full" />
                  </div> */}
                </div>
              </div>
            ) : (
              <>
                {claudeResponse.map((response, index) => (
                  <div key={index} className="flex px-2">
                    <div className="h-10 w-10 rounded-full mr-2">
                      <Avatar>
                        <AvatarImage src="https://avatars.githubusercontent.com/u/76263028?s=200&v=4" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col gap-2">
                      <i className="ml-3">Buildsmart AI (Claude)</i>
                      <div className="pl-2 bg-white w-fit mt-0 m-3 rounded-md text-black text-lg p-2">
                        {response}
                      </div>
                    </div>
                  </div>
                ))}
                {userMessages.map((message, index) => (
                  <div
                    key={index}
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
                        {message}
                      </div>
                    </div>{" "}
                  </div>
                ))}
              </>
            )}
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
