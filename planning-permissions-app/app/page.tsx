"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [promptOutput, setPromptOutput] = useState<string>("");
  const [usersProject, setUsersProject] = useState<any>({});
  const router = useRouter();

  async function callBackend(): Promise<void> {
    router.push(`/permissions-chat?message=${encodeURIComponent(usersProject)}`);
  }

  return (
    <main className="flex h-[95dvh] flex-col items-center justify-between pt-4 w-fill">
      <div
        id="logo"
        className="flex flex-col gap-2 max-w-5xl w-fill md:w-fit text-2xl md:text-4xl text-accent font-extrabold items-center text-center lg:flex"
      >
        Buildsmart
        <div
          id="tagline"
          className="text-xl md:text-2xl text-accent font-semibold text-center w-fit"
        >
          Planning permission requirements, advice and guidance
        </div>
      </div>
      <div className="self-center flex flex-col gap-2 w-[90%] md:w-[40%] text-center">
        <div id="description" className="text-center text-md">
          We use AI to reduce effort when thinking about planning permission
          across the UK
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="I want to extend my 3-bedroom home in Surrey by..."
            className=""
            onChange={(e) => setUsersProject(e.target.value)}
          ></Input>
          <Button onClick={callBackend} className="w-fit self-center">
            Use AI 🪄
          </Button>
        </div>
        <div
          id="cta"
          className="text-center text-md flex flex-col mt-10 items-center gap-2"
        >
          See which councils we can support with here ⬇️
          <Button variant={"secondary"} className="w-fit">
            View councils
          </Button>
        </div>
      </div>
      <div className="mt-5">{promptOutput}</div>
    </main>
  );
}
