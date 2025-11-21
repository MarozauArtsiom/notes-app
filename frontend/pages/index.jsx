import React from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import * as Popover from "@radix-ui/react-popover";
import TopBar from "../components/TopBar";
import NotesList from "../components/NotesList";
import TestApi from "../components/TestApi";

const featureItems = [
  {
    value: "capture",
    title: "Capture quickly",
    text: "Radix-powered inputs, keyboard focus rings, and a calm light-blue palette keep you in the flow.",
  },
  {
    value: "organize",
    title: "Organize with clarity",
    text: "Accordion and scroll areas tame long lists, so you can skim, collapse, and reopen without losing place.",
  },
  {
    value: "trust",
    title: "Trust the pipeline",
    text: "Run the API test walkthrough to confirm the backend is healthy before you settle in to write.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 pb-16 pt-10 space-y-12">
        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] shadow-md shadow-primary/30">
              <span className="text-base" aria-hidden>
                *
              </span>
              Crafted with Radix UI
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                Notes with a breezy, focused feel.
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything from navigation to dialogs leans on Radix
                accessibility while the light-blue palette keeps distractions
                low.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/notes"
                className="btn-primary"
              >
                Open the workspace
                <span aria-hidden className="text-lg">
                  &gt;
                </span>
              </Link>

              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="btn-secondary">
                    Quick tour
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="rounded-2xl border border-border bg-card p-4 shadow-xl w-[260px]">
                    <p className="text-sm text-muted-foreground mb-2">
                      Explore tabs, dialogs, and accordions wired up with Radix
                      UI. Everything is keyboard friendly and screen reader
                      ready.
                    </p>
                    <Popover.Close className="mt-2 text-sm font-semibold text-primary hover:text-lightblue-700">
                      Got it
                    </Popover.Close>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>

          <div className="surface-card overflow-hidden relative">
            <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-lightblue-100 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-secondary blur-3xl" />
            <div className="relative space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                What&apos;s inside
              </p>
              <Accordion.Root
                type="single"
                collapsible
                className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card"
              >
                {featureItems.map((item) => (
                  <Accordion.Item key={item.value} value={item.value}>
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                        <span>{item.title}</span>
                        <span
                          aria-hidden
                          className="transition-transform duration-200 data-[state=open]:rotate-90"
                        >
                          &gt;
                        </span>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="px-4 pb-4 text-sm text-muted-foreground bg-muted">
                      {item.text}
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
              <div className="rounded-xl bg-primary text-primary-foreground p-4 shadow-lg shadow-primary/40 text-sm">
                Keep typing - focus management and ARIA labels from Radix make
                experience calm and predictable for everyone.
              </div>
            </div>
          </div>
        </section>

        <section id="api-test" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Quality check
              </p>
              <h2 className="text-2xl font-semibold">
                Run the API walkthrough
              </h2>
            </div>
            <Link
              href="/notes"
              className="text-sm font-semibold text-primary hover:text-lightblue-700"
            >
              Go to full workspace
            </Link>
          </div>
          <div className="surface-card">
            <TestApi />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Live preview
              </p>
              <h2 className="text-2xl font-semibold">Latest notes</h2>
            </div>
            <Link
              href="/notes"
              className="text-sm font-semibold text-primary hover:text-lightblue-700"
            >
              Manage notes
            </Link>
          </div>
          <div className="surface-card">
            <NotesList />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
