import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
