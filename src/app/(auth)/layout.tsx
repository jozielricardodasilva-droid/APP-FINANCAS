import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center gap-2 text-xl font-semibold tracking-tight">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="size-5" />
        </span>
        App Finanças
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
