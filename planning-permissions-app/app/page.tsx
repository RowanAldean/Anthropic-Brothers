import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-5xl w-full items-center text-center font-mono text-sm lg:flex">
       Permission Plannie
      </div>
      <div className="self-center">
          <Input type="text" placeholder="Describe what you're looking to get planning permissions for?" className='w-[50rem]'></Input>
          <Button>Ask Plannie</Button>
        </div>
    </main>
  )
}
