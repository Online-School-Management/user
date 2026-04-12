/**
 * Fixed mesh + soft blobs (brand blue / orange). Sits behind page content for glassmorphism.
 */
export function GlobalAppBackdrop() {
  return (
    <div
      className="global-app-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="global-app-backdrop__base absolute inset-0" />
      <div className="global-app-backdrop__mesh absolute inset-0 opacity-90" />
      <div className="global-app-backdrop__blob global-app-backdrop__blob--blue" />
      <div className="global-app-backdrop__blob global-app-backdrop__blob--orange" />
      <div className="global-app-backdrop__blob global-app-backdrop__blob--blue-soft" />
    </div>
  );
}
