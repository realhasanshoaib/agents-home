# Flow: their application filled in by voice

Start from the Mercury build, branch `flow-mercury` of moet-poc. Make a worktree from that branch if this machine has none, and report it missing rather than starting from another build. Q9 Brain Canon `mercury-flow-pitch` records what was decided and why.

- **What to rebuild.** Their real application or intake form, with its steps, step rail, colours and type. Use the closest free font when theirs is proprietary.
- **What the guide catches.** Research the mistakes that stall their applications, and make the voice guide catch them while the person talks, with the fields filling live. Mercury's were the wrong EIN document, a virtual address as the place of business, and a holding company listed as an owner.
- **Where it goes.** Make a branch `flow-<prospect>` in its own worktree, and deploy it as its own Worker on the hostname in the brief, with the Cloudflare token "Oort Workers Cloudflare" through `2password`. Leave flow.q9labs.ai alone: it runs code that is in no branch, and deploying it from git would wipe that code.
