import { AccessArtwork } from "./access-artwork";
import "./login.css";
/** Product adaptation of jahed's Sign In (https://21st.dev/r/jahed/sign-in).
 * Presentation only; authentication and demo controls remain separate.
 */
export function AccessLayout({
  children,
  controls,
}: {
  children: React.ReactNode;
  controls: React.ReactNode;
}) {
  return (
    <main id="contenido" className="login-scene">
      <div className="access-panel">
        <section className="login-form-area" aria-label="Acceso">
          <div className="login-card">{children}</div>
        </section>
        <aside className="login-visual" aria-hidden="true">
          <div className="login-image">
            <AccessArtwork />
          </div>
        </aside>
      </div>
      {controls}
    </main>
  );
}
