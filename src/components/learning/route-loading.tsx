export function RouteLoading({ kind }: { kind: "lesson" | "game" }) {
  return (
    <section className="screen-page route-loading" aria-busy="true">
      <p role="status" className="muted">
        Loading {kind}…
      </p>
      <div className="route-loading-heading" aria-hidden="true" />
      <div
        className={`route-loading-panels ${kind === "game" ? "single" : ""}`}
        aria-hidden="true"
      >
        <div />
        <div />
      </div>
      <div className="route-loading-actions" aria-hidden="true" />
    </section>
  );
}
