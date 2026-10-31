# Code review

Review the relevant changes for consequential defects, including incorrect behavior, data loss, security issues, and regressions. Explain findings with concrete evidence; reproduce them when practical. Don't turn style preferences into blockers.

By default, the builder reviews and verifies their own work. Use a fresh Sol 6.1 xhigh judge when the risk warrants another set of eyes, such as for irreversible data loss or a security boundary. Hasan can request or skip a judge for any change.

Give the judge the scope, revision, and context it needs, but keep it non-biased. Fix consequential findings and verify the fixes; use a targeted re-review when needed. A failed or incomplete review is not a clean review.

Don't run review rounds. A finding blocks a merge only when it is a P0, a P1, a leak, or data loss: fix it once at the root, then merge on green. Every other finding, including new ones that a re-review raises on the fix, goes to a follow-up issue without another push.

Before merging, make sure the final changes have the required verification and checks.
