import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
      <p className="mt-4 text-gray-600">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" passHref>
        <Button className="mt-6 px-6 py-2 text-white bg-black hover:bg-gray-800">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
