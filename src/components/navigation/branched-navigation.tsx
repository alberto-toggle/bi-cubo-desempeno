"use client";
import Link from "next/link";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown, type LucideIcon } from "lucide-react";
import "./branched-navigation.css";
export type BranchLink = { href: string; label: string; icon: LucideIcon };
export type BranchGroup = { label: string; links: BranchLink[] };
/** Adapted from React Bits BranchedMenu. SVG branch geometry retained;
 * Base UI disclosure and real links support keyboard and router semantics.
 */
export function BranchedNavigation({
  groups,
  pathname,
  onNavigate,
}: {
  groups: BranchGroup[];
  pathname: string;
  onNavigate: () => void;
}) {
  const row = 42,
    pad = 6,
    trunk = 12,
    radius = 10,
    end = 30;
  return (
    <nav aria-label="Secciones" className="branch-nav">
      {groups.map((group) => (
        <Collapsible.Root
          key={group.label}
          defaultOpen
          className="branch-group"
        >
          <Collapsible.Trigger className="branch-heading">
            {group.label}
            <ChevronDown size={14} />
          </Collapsible.Trigger>
          <Collapsible.Panel className="branch-panel">
            <div className="branch-tree">
              <svg
                className="branch-lines"
                width="36"
                height={pad * 2 + group.links.length * row}
                aria-hidden="true"
              >
                <path
                  className="branch-line"
                  d={`M${trunk} 0 V${pad + (group.links.length - 0.5) * row - radius}`}
                />
                {group.links.map((link, i) => {
                  const y = pad + i * row + row / 2;
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  const length =
                    y - radius + (Math.PI * radius) / 2 + end - trunk - radius;
                  return (
                    <g key={link.href}>
                      <path
                        className="branch-line"
                        d={`M${trunk} ${y - radius} A${radius} ${radius} 0 0 0 ${trunk + radius} ${y} H${end}`}
                      />
                      <path
                        className="branch-reach"
                        d={`M${trunk} 0 V${y - radius} A${radius} ${radius} 0 0 0 ${trunk + radius} ${y} H${end}`}
                        style={{
                          strokeDasharray: length,
                          strokeDashoffset: active ? 0 : length,
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
              {group.links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className="branch-link"
                  aria-current={
                    (
                      href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(href)
                    )
                      ? "page"
                      : undefined
                  }
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      ))}
    </nav>
  );
}
