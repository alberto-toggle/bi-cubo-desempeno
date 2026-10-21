import { Component as Globe } from "./component";

export default function Demo() {
  return (
    <div className="flex min-h-[560px] items-center justify-center bg-background p-3 sm:p-8">
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-card overflow-hidden relative">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center p-6 md:p-10 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-6 w-fit">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
              All systems operational
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-4">
              Global Edge
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Network
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed mb-8">
              Deployed across 150+ points of presence worldwide. Your data
              served from the nearest node in under 50ms. Drag the globe to
              explore.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">150+</p>
                <p className="text-xs text-muted-foreground">Edge Nodes</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">&lt;50ms</p>
                <p className="text-xs text-muted-foreground">Avg Latency</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">99.99%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right — Globe */}
          <div className="min-w-0 flex-1 flex items-center justify-center p-4 md:p-0">
            <Globe size={460} />
          </div>
        </div>
      </div>
    </div>
  );
}
