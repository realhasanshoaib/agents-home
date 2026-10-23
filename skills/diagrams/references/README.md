# Diagram style reference

Hasan likes these architecture and system diagrams. Use them as inspiration, not as templates.

- `architecture-diagram-style.png` is the original reference: the systems and how they connect.
- `architecture-numbered-flow.png` uses the same style for one flow. Numbered circles on the arrows give the order, so you can follow a request through the system.
- `sequence-flow.png` is a sequence diagram of the same flow. Each system is a column and time runs down the page, split into named phases. It is best when the order matters more than the layout.
- `chalk-recording/` holds the HTML that drew both. `sequence.html` lists lanes and steps and `seq.js` draws them, with phases, branches for alternatives, notes, loops, and a route or token line under each arrow, so a new flow means editing that list. `recording.html` is placed by hand. Both use the shared `../logos/` cache relative to this README. The Chalk facts in these files are not kept current; check every arrow of a new diagram against the code.

Hasan wants a diagram of a specific flow on request, often both kinds: the sequence diagram for the order, and the architecture view when the layout matters.

The style:

- Warm off-white background, lots of whitespace, no heavy shadows or gradients.
- Main systems sit in large rounded boxes with a thin light-grey border, a bold dark title, and a grey subtitle line.
- Real brand logos (from svgl.app) sit next to each service or technology name. Small grey pill tags mark open questions or sub-parts.
- Arrows are thin and straight, or bend at right angles. Teal arrows carry results and outputs, dark navy arrows carry requests. Each arrow gets a short lowercase label.
- Grey text marks uncertainty ("AWS · likely", "Model ?"). An amber dot with a short note, or a dashed amber arrow, marks what is only partly built.
- Monospace text for tool, command, or machine-size names.
- Groups of related items (like Services on the left) are joined by a thin bracket instead of a box.
