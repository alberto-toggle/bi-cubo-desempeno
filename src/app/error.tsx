"use client";
export default function ErrorPage({reset}:{reset:()=>void}) {return <div className="surface p-8" role="alert"><h2 className="text-xl font-semibold">No pudimos mostrar esta vista.</h2><p className="my-4 text-muted-foreground">Intenta cargarla de nuevo.</p><button className="primary-button" onClick={reset}>Reintentar</button></div>;}
