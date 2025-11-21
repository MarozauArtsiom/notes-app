import React from "react";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as HoverCard from "@radix-ui/react-hover-card";

const navItems = [
  {
    label: "Home",
    href: "/",
    blurb: "Overview and quick actions to keep you oriented.",
  },
  {
    label: "Notes",
    href: "/notes",
    blurb: "Create, edit, and organize the ideas that matter most.",
  },
  {
    label: "API Test",
    href: "/#api-test",
    blurb: "Run the built-in client walk-through against your backend.",
  },
];

const TopBar = () => {
  return (
    <header className="sticky top-0 z-30 navbar shadow-md">
      <div className="navbar-container">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl font-black transition group-hover:scale-105">
            N
          </div>
          <div className="leading-tight text-white">
            <div className="text-xs uppercase tracking-[0.16em] text-white/75">
              Notes Studio
            </div>
            <div className="text-lg font-semibold group-hover:underline">
              Radix Edition
            </div>
          </div>
        </Link>

        <NavigationMenu.Root className="relative">
          <NavigationMenu.List className="navbar-menu rounded-full bg-white/15 px-1 py-1 shadow-sm shadow-black/10">
            {navItems.map((item) => (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Trigger className="navbar-link px-3 py-2 rounded-full text-sm font-medium data-[state=open]:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                  {item.label}
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full mt-2 w-72 rounded-2xl bg-card border border-border shadow-xl">
                  <div className="p-4 space-y-2 text-left">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </div>
                    <p className="text-sm text-foreground/80">{item.blurb}</p>
                    <HoverCard.Root openDelay={80}>
                      <HoverCard.Trigger asChild>
                        <NavigationMenu.Link asChild>
                          <Link
                            href={item.href}
                            className="btn-primary w-full text-center"
                          >
                            Go to {item.label}
                          </Link>
                        </NavigationMenu.Link>
                      </HoverCard.Trigger>
                      <HoverCard.Content className="rounded-xl border border-border bg-card p-4 shadow-lg text-xs text-muted-foreground">
                        Built with Radix primitives, so keyboard and screen
                        reader flows are cared for.
                      </HoverCard.Content>
                    </HoverCard.Root>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
          <NavigationMenu.Viewport className="absolute right-0 top-[calc(100%+8px)] w-72" />
        </NavigationMenu.Root>
      </div>
    </header>
  );
};

export default TopBar;
