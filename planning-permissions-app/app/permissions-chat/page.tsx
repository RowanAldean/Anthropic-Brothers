"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideArrowBigRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [promptOutput, setPromptOutput] = useState<string>("");
  const [claudeResponse, setClaudeResponse] = useState<string[]>(['This is hardcoded test message']);
  const [userMessages, setUserMessages] = useState<string[]>([]);

  async function callBackend(): Promise<void> {
    const backendResponse = await fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document: "Hi i'm the council" }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPromptOutput(result);
        setClaudeResponse([...claudeResponse, result]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function submitMessage(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
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
        <div id="chat-window" className="flex flex-col self-center mx-1 my-5 md:my-10 md:w-[50%] h-auto bg-accent/20 rounded-md">
          <div className="font-extrabold flex w-full py-4 self-start justify-center text-center text-lg">Do you even need permissions?</div>
          <div id="chat-messages" className="flex flex-col">
            {claudeResponse.map((response, index) => (
              <div key={index} className="pl-2 bg-white w-fit m-3 rounded-md text-black text-lg p-2">{response}</div>
            ))}
            {userMessages.map((message, index) => (
              <div key={index} className="pr-2 self-end bg-accent w-fit m-3 rounded-md text-black text-lg p-2">{message}</div>
            ))}
          </div>
          <hr></hr>
          <div id="chat-input" className="flex w-full gap-2 items-center justify-center">
            <Input type="text" placeholder="Reply to Buildsmart AI here" className="w-[100%] bg-muted m-3 mr-0 placeholder:text-secondary/50"></Input>
            <Button variant={"secondary"} onClick={submitMessage} className="m-3 ml-0"><LucideArrowBigRight></LucideArrowBigRight></Button>
          </div>
        </div>
      </div>
    </main>
  );
}
