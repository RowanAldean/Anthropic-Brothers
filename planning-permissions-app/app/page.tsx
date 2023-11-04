"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [promptOutput, setPromptOutput] = useState<string>("");

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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-5xl w-full items-center text-center font-mono text-sm lg:flex">
        Permission Plannie
      </div>
      <div className="self-center">
        <Input
          type="text"
          placeholder="Describe what you're looking to get planning permissions for?"
          className="w-[50rem]"
        ></Input>
        <Button onClick={callBackend}>Ask Plannie</Button>
      </div>
      <div className="mt-5">
        {promptOutput}
      </div>
    </main>
  );
}
