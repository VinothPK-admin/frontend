"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[70vh] px-6 pt-40 pb-24 flex items-center justify-center text-center">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#C5A46E] mb-5">Something went wrong</p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5">We couldn&apos;t load this page.</h1>
        <p role="alert" className="text-white/50 mb-8">Please try again in a moment. If the problem continues, contact the store.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="rounded-full bg-[#C5A46E] px-6 py-3 font-bold text-black">Try again</button>
          <Link href="/" className="rounded-full border border-white/20 px-6 py-3 font-bold text-white">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
