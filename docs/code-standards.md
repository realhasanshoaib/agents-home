# Code standards

Write readable, modular code with canonical names, early returns, inferred internal types, typed boundaries, type-safe state, focused functions, and explicit data flow. Match the surrounding codebase and keep changes surgical.

Avoid defensive checks for unreachable states, speculative abstractions, wrappers around one-liners, duplicated logic, deep nesting, ternary chains, hidden coupling, and surprising side effects. Split files when their responsibilities stop being easy to hold in one head.

Comments explain constraints the code cannot express; they do not narrate the implementation. Preserve existing behavior unless the request changes it, and preserve accessibility, security, and privacy whenever related code is touched.

Before adding a dependency, check its maintenance, release recency, adoption, vulnerabilities, and supply-chain risk. Prefer the project's existing package manager and patterns.

Bug fixes should include a regression test when the behavior can be reproduced at a stable boundary. A change is complete only after it has been exercised through the real path it modifies.
