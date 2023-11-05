"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideArrowBigRight, LucideMousePointer2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [topTips, setTopTips] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);

  const [usersProject, setUsersProject] = useState<any>({});
  const router = useRouter();

  async function callBackend(promptMessage: string): Promise<void> {
    console.log(`MESSAGE QUERY IS: ${promptMessage}`);
    const backendResponse = await fetch("/api/prompt-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptMessage }),
    })
      .then((response) => response.json())
      .then((result) => {
        const parsedResult = parseClaudeResponse(result);
        const topTips = showAsList(parsedResult[0]);
        const redFlags = showAsList(parsedResult[1]);
        setTopTips(topTips);
        setRedFlags(redFlags);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function parseClaudeResponse(result: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(result, "text/xml");
    const topTips = Array.from(xmlDoc.getElementsByTagName("top-tips")).map((node) => node.textContent).join("");
    const redFlags = Array.from(xmlDoc.getElementsByTagName("red-flags")).map((node) => node.textContent).join("");
    return [topTips, redFlags];
  }

  function showAsList(result: string){
    const list = result.split('\n').map(item => item.trim().replace('-', ''));
    return list;
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initalMessage = urlParams.get("message");
    callBackend(initalMessage);
  }, []);

  return (
    <main className="flex h-full flex-col items-center justify-between pt-4 w-fill">
      <div
        id="logo"
        className="flex flex-col gap-2 self-center md:self-start md:pl-[10px] max-w-5xl w-fill md:w-fit text-2xl md:text-4xl text-accent font-extrabold items-start text-center lg:flex"
      >
        <a href="/">Buildsmart</a>
      </div>
      <div id="chat-window-container" className="flex flex-col w-full h-full">
        <div className="text-xl md:text-2xl font-bold self-center mt-2 md:mt-5 px-5">
          Things for your application based on your area
        </div>
        <div
          id="comparison-container"
          className="flex flex-col md:flex-row self-center items-center justify-around gap-5 w-full mx-1 my-5 md:my-10 md:w-[50%] h-auto"
        >
          <div className="flex flex-col items-center md:w-[50%] mx-5 justify-center text-center bg-accent/20 rounded-md p-5">
            <div className="md:text-2xl font-semibold">Best Practices 🏅</div>
            {topTips.map((tip, index) => (
              <li key={index} className="text-xl">{tip}</li>
            ))}
          </div>
          <div className="flex flex-col items-center md:w-[50%] justify-center text-center bg-accent/20 rounded-md p-5">
            <div className="md:text-2xl font-semibold">Red Flags 🚩</div>
            {redFlags.map((flag, index) => (
              <li key={index} className="text-xl">{flag}</li>
            ))}
          </div>
        </div>
        <div className="self-center">
          <Button
            className="text-lg gap-2"
            onClick={() => {
              router.push("/guidance");
            }}
          >
            Get guidance<LucideMousePointer2></LucideMousePointer2>
          </Button>
        </div>
      </div>
    </main>
  );
}
