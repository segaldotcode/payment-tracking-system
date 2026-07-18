import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Payment Tracking System
        </h1>
        <p className="max-w-md text-muted-foreground">
          Payment lifecycle tracker with state machine, refund flow and
          receipt linking. Implementation in progress.
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}
