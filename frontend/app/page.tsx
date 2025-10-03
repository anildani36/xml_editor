import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})
export default function Home() {
  return (
    <main className="bg-radial from-sky-400 to-blue-800 flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-6 text-center bg">
        <h1 className={cn("text-6xl front-semibold text-white drop-shadow-md", font.className)}>
        🔐 Auth
        </h1>
        <p className="text-white text-lgs">
          An authentication service
        </p>
        <div>
          <LoginButton>
            <Button 
              className="cursor-pointer"
              variant="secondary" 
              size="lg"
            >
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>

    </main>
  );
}
