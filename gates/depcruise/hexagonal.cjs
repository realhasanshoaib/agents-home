// Hexagonal import direction: domain core never imports the edges.
// Adapt the layer globs to the project (these match an Ava-style layout),
// then run: depcruise src --config gates/hexagonal.cjs
module.exports = {
  forbidden: [
    {
      name: "domain-imports-edge",
      comment:
        "Domain core must not depend on transport, framework, or wiring code — dependencies point inward.",
      severity: "error",
      from: { path: "^src/domains" },
      to: { path: "^src/(http|app|infra|adapters|routes)" },
    },
    {
      name: "no-circular",
      comment: "Circular imports hide coupling and break traceability.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
  },
};
