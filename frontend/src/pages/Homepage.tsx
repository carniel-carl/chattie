import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/react";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

function HomePage() {
  return (
    <div className="h-screen bg-base-100 text-base flex">
      {/* LEFT SIDE */}
      <div className="flex flex-1 flex-col p-8 lg:p-12 relative overflow-hidden gap-10">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="size-9 rounded-xl bg-linear-to-br from bg-amber-400 to-orange-500
             flex items-center justify-center shadow-lg shadow-gray-500/20
          "
            >
              <SparklesIcon className="size-5 text-primary-content" />
            </div>
            <span className="text-xl font-bold">Chattie</span>
          </div>

          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <Button className="">Sign in</Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button className="gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-sm font-semibold hover:opacity-90 shadow-lg shadow-orange-500/25 border-none">
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </SignUpButton>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col justify-center max-w-xl relative z-10">
          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight font-mono">
            Messaging for
            <br />
            <span className="bg-linear-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              everyone
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-md">
            Secure, blazing-fast conversations with real-time presence and
            instant delivery. Connect with anyone, anywhere.
          </p>

          {/* Avatars */}
          <div className="mt-8 flex items-center gap-4">
            <div className="avatar-group -space-x-3">
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar avatar-placeholder">
                <div className="w-10 rounded-full border-2 border-base-100 bg-base-300 text-base-content">
                  <span className="text-xs font-mono">+5k</span>
                </div>
              </div>
            </div>
            <span className="text-sm text-base-content/70">
              Join{" "}
              <span className="font-mono text-base-content/80">10,000+</span>{" "}
              happy users
            </span>
          </div>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-1 relative bg-base-200 items-center justify-center overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
           bg-linear-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-[100px]"
        />

        {/* Image Container */}
        <div className="relative z-10">
          {/* Decorative border */}
          <div className="absolute -inset-px rounded-3xl bg-linear-to-b from-white/20 to-white/5 p-px">
            <div className="w-full h-full rounded-3xl bg-base-200" />
          </div>

          {/* Card */}
          <div className="relative p-6 rounded-3xl border border-base-300 bg-base-200/80 backdrop-blur-xl shadow-2xl">
            <img
              src="/auth.png"
              alt="Chat illustration"
              className="w-80 xl:w-96 rounded-2xl"
            />

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
              ● 3 online
            </div>

            <div className="absolute -bottom-4 -left-4 px-4 py-2.5 bg-base-300/40 border border-base-300 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-400 to-orange-500" />
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-rose-400 to-pink-500" />
                </div>
                <span className="text-sm text-base-content/80">typing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
