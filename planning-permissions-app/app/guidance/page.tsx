"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CornerDownLeft, LucideArrowBigRight, LucideMousePointer2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [promptOutput, setPromptOutput] = useState<string>("");
  const [usersProject, setUsersProject] = useState<any>({});
  const router = useRouter();

  async function callBackend(): Promise<void> {
    router.push(
      `/permissions-chat?message=${encodeURIComponent(usersProject)}`
    );
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
        <div className="text-xl md:text-2xl font-bold self-center mt-2 md:mt-5 px-5">
          Learn from others mistakes
        </div>
        <div className="text-lg md:text-xl font-normal self-center mt-1 md:mt-3 px-5">
          Our AI suggests the following applications were similar to your
          project...
        </div>
        <div
          id="comparison-container"
          className="flex flex-col md:flex-row self-center items-center justify-around gap-5 w-full mx-1 my-5 md:my-10 md:w-[50%] h-auto"
        >
          <div className="flex flex-col items-center md:w-[50%] mx-5 justify-center text-center bg-primary/30 rounded-md p-5">
            <div className="md:text-2xl font-semibold">Approved ✅</div>
            <li className="text-xl">Hello, test best</li>
          </div>
          <div className="flex flex-col items-center md:w-[50%] justify-center text-center bg-primary/30 rounded-md p-5">
            <div className="md:text-2xl font-semibold">Rejected ❌</div>
            <li className="text-xl">Hello, test flag</li>
          </div>
        </div>
        <div className="self-center flex flex-col gap-2">
            <div className="text-lg text-center self-center">
                Have more projects you'd like to pass by Buildsmart AI?
            </div>
          <Button
            className="text-lg gap-2"
            variant='secondary'
            onClick={() => {
              router.push("/");
            }}
          >
            Try another<CornerDownLeft></CornerDownLeft>
          </Button>
        </div>
      </div>
    </main>
  );
}
