import { Logo } from "@/components/icons/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <a className="mr-2 flex items-center space-x-2" href="/">
            <Logo className="h-6 w-6" />
            <span className="font-bold">Expyra Scan</span>
          </a>
        </div>
      </div>
    </header>
  );
}
