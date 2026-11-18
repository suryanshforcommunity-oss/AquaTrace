import Link from "next/link";
import { Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-4">
        <Droplets className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">404 - Page Not Found</h1>
      <p className="mt-2 text-xs text-slate-500 max-w-md">
        The water intelligence module or telemetry route you requested could not be located.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
      >
        Return to Dashboard &rarr;
      </Link>
    </div>
  );
}
