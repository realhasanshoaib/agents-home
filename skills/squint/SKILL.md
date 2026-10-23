---
name: squint
user-invocable: true
disable-model-invocation: false
description: "Use when building, reviewing, or cleaning up product UI or interface copy, including screens, shared components, forms, tables, charts, dashboards, navigation, dialogs, and emails."
---

# squint

Designers squint at a screen to blur the detail away and see what really stands out. This skill holds UI to that test and a few others like it.

The project's design system (a `design.md`, a design-system README, or its tokens) decides the look: colors, radii, fonts, and project rules. It wins over this skill on how things look, but not on accessibility or on how people recover from errors. Changing a design-system rule needs the project owner's approval, because it changes every future screen. If a project has no written design system and the work touches more than one screen, propose one before you change screens.

People scan software instead of reading it, and they don't want to spend effort on it. Design for low attention, not low intelligence.

Each section below states a principle in its heading, then gives examples. The examples are cases already decided, not a complete list. For a case they don't cover, apply the principle. When an example doesn't fit the context, follow the principle and say why. Examples use web terms; on native platforms, use the platform's equivalent.

## How to work

Fix causes, not symptoms. A problem that repeats across screens lives in a shared piece, so fix it there once. Scale the process to the change: a copy fix needs steps 1, 5, and 6, and a redesign needs every step.

1. Read the design system, the glossary, and the shared component library, where they exist, before you touch a screen.
2. Audit the affected screens at phone, laptop, and wide desktop sizes (for example 390, 1440, and 1920 pixels wide), in each language, direction, and theme the project supports. Look for patterns built by hand on two or more screens; those belong in a shared component.
3. Fix shared pieces before screens. Prove each new piece on one real screen, show before and after, and get approval before you move the other screens onto it.
4. When there are several look options and the project can switch variants live (a dev panel or a preview route), add them there so the owner can compare them. Keep only the winner.
5. Verify: type check, lint, the project's checks, reduced motion, and before and after screenshots side by side of each changed screen at the step 2 sizes, directions, and themes. A one-screen fix needs only a phone and a laptop size in each direction.
6. Try to break it, as the last section describes, and report what failed or is unproved first.

## Every element earns its place

Every element must help the user do the task on this screen. Test each one: if you remove it, does the user lose information, an action, or the ability to recognize something at a glance? If not, remove it. Decoration, restatement, and reassurance fail this test.

For example, leave out:

- Eyebrows (small uppercase labels above headings), and subtext that restates the heading.
- Generic reassurance such as "Your account is protected", greetings, and marketing banners inside the product. Reassurance that carries a fact, such as who is doing what and how long it takes, stays.
- Badges and pills on normal states. Normal states are plain text; a badge marks an exception.
- Icon tiles: tinted squares or circles behind icons.
- Stat cards that repeat counts already shown by tabs or lists.
- Placeholders that repeat the label, and breadcrumbs that repeat the page title.
- The same action offered twice on one screen.

## Minimal is not bare

Removing noise is not removing meaning. Add a signal when, without it, the user couldn't tell at a glance what something is, what state it's in, or what to do next. Prefer patterns people already know, because recognizing costs less than learning.

For example:

- An icon beside a fact (a pin before a location) or on an action (a video icon on a call button), drawn plain.
- Status shown as a small colored dot and its word ("● Open"). Color never carries meaning alone.
- An avatar color derived from a person's name when there is no photo.
- Chat bubbles like a messaging app, or a settings list with plain leading icons, instead of a generic list of fields.
- Clickable things that look clickable: a whole row opens its detail page through a real link in the row, and "View all" shows an arrow on hover.
- Palette colors at full strength where color carries meaning. Washed-out tints with visible borders read as unfinished.
- A page people open from a shared link shows a preview card in chats and email, not a bare URL: a title, a one-line description, and a 1200×630 image of the page itself (`og:title`, `og:description`, `og:url`, and `og:image` on the web). A private demo also tells search engines not to list it (`noindex`). After you deploy, check that the live image loads.

## Never ship AI tells

If an element is there because it looks designed and not because the product needs it, it's probably one of these:

- Purple or blue-to-purple gradients, neon, glows, and colored shadows under buttons.
- Colored side stripes on cards, glassmorphism, 3D blobs, and floating fake UI cards.
- Hero sections, "Welcome back", or "Start your journey" inside the app.
- Decorative "01 02 03" numbers and benefit strips with checkmarks.
- Emoji in the interface, and flags for languages, because a flag stands for a country.
- Generic stock photos, and illustrations that don't match the product.

When you generate images, put the project's palette, this list, and "no text, letters, logos, or people" into every prompt. Check each result yourself, because generators add text and clichés anyway.

## Layout shows what matters first

Layout tells people what matters and what belongs together. The eye should land on the heading, then the main action, then the work. To test it, blur the screenshot and name the first three things you see. Things that belong together sit closer than things that don't, and the same gap means the same thing everywhere. Spacing is usually what holds a screen back, so check it first.

Give content the width it needs. Reading text and forms are narrow, about 40rem, inside a page column capped at about 80rem. Working surfaces, such as a chat, an editor, a map, or a wide table, take all the space they need.

For example:

- One heading and at most one main action per page. Other actions sit next to what they change: form actions at the end of the form, row actions at the end of the row.
- The work comes first. Summary numbers appear only when they help a decision.
- One surface per group of related content. No card inside a card, and no card around a page that holds a single form.
- Layout follows the content's shape: steps in order are a list, and a field is as wide as its answer.
- On phones, the same order as desktop, and nothing decorative first.
- Nested pages get a back link that names the parent.
- Tables align numbers to the end with tabular figures, so digits line up.
- A chart answers one question. A line shows a trend, bars compare, and bars start at zero. Label the lines directly instead of using a legend when you can.

## The control fits the answer

Pick the control from the shape of the answer. The best control shows the options without a click, and makes wrong answers impossible. To test it, enter a typical value, a boundary value, and "I don't know". The user must be able to give every valid answer without guessing units, format, or an option that isn't there.

| The answer is | Use | Avoid |
| --- | --- | --- |
| One of two to four options | Segmented control or radio buttons | A dropdown |
| One of many | Select, or a searchable combobox | Free text |
| Several from a known list | Multi-select with removable chips | Comma-separated text |
| A setting that applies right away | Switch | Checkbox plus Save |
| Agreement, or an option in a form | Checkbox | Switch |
| A small whole number | Stepper | Full-width text input |
| An exact amount, such as money | Text input with the currency shown | Slider |
| A rough position on a scale | Slider that shows its value | Number input |
| A date people know by heart, such as a birth date | Day, month, and year fields | A calendar picker |
| Any other date | Date picker in the page language | Free text |
| An optional extra, such as a promo code | A disclosure that reveals the field | An always-open field |

Pick where a task happens from what the user must keep in view. Use a page when the work needs a URL or must survive a reload. Use a drawer when the user still needs to see the list. Use a dialog for everything else: one confirmation or a few fields. Rarely changed settings show as read-only values with an Edit action, not as forms that are always open. Where data refreshes on its own, show no Refresh button.

In a form, ask clearly, help the user answer, catch mistakes early and say how to fix them, never lose what they typed, and never leave them unsure whether it worked. For example: a visible label on every field, validation when the user leaves a field and on submit, errors under the field they belong to, every typed value kept after a failed submit, a pending state that blocks a double submit, and Undo (or a confirm for what can't be undone) on destructive actions. A control that can't be used says why.

## Everyone can use it

Use the native element that means what you are building. On the web that is `button` for actions, `a` for navigation, `label` for fields, headings in order, `nav`, `dialog`, and `table`; native apps have the platform's own controls and accessibility traits. The platform then gives most keyboard and screen-reader behaviour for free. Add what it can't know, such as an error linked to its field (`aria-describedby` on the web), and move focus yourself when content opens or closes. Build a custom widget only when no native element fits, and then follow its WAI-ARIA pattern or the platform's equivalent.

Never rely on one sense or one input. Color, hover, and position each need a second signal, and everything that works with a mouse must work with a keyboard and on touch.

Test it: finish the task with only the keyboard, with a visible focus ring at every step. Check that each control has a name, a role, and a state a screen reader can announce. Meet WCAG AA contrast, and make touch targets at least 44 points on phones.

## Fix it once, in the shared piece

A shared component owns how something looks and behaves. The app owns what it says and where it goes. So components take their words and links from outside, and screens never restyle them by hand.

- Use the design system's semantic roles, never raw colors. If the project has themes or brands, check each one, because a role a theme forgets to set leaks the default brand color into another brand.
- Motion explains where something came from or went, so it starts from its source and stays short. If it explains nothing, cut it. Respect reduced motion.
- Remove what a change makes unused: props, copy keys, styles, assets, and whole files.

## Copy speaks the user's words

Every string answers one question for the user: what is this, what happens if I act, or what do I do now? Write it in their words, short enough to scan, in sentence case. To test a word, ask whether a user who has never seen the code would say it.

For example:

- Buttons use a verb and an object: "Save changes", "Invite member", not "Submit" or a noun alone. Cancel, Close, and Back are the exceptions.
- No internal states, flags, or plumbing in the UI: "gated", "source of truth", raw enum values.
- One name per thing in every screen and language, from the glossary where there is one.
- Errors say what happened and how to fix it. Empty states say what will appear and how to fill it. Loading labels say what is happening: "Signing in…", not "Please wait…".
- Numbers, dates, and money follow the user's locale.
- No em dashes in interface text.

Match the tone to the moment. Money, rejections, and suspensions are serious and specific: what happened, what it means, and what to do next. Waiting says who is doing what and roughly how long it takes. Milestones get one warm line. Routine screens get labels and actions only.

## Every language is a full product

Each language is a full product, not a translation layer. To test it, do the same task in each supported locale, including validation errors, number and date formats, and user content in the other direction.

For example:

- Write each language natively instead of translating line by line, and show one language per screen.
- Lay out with start and end (CSS logical properties on the web), never left and right, so layouts mirror. Icons that point a direction flip; icons that show an object don't.
- Text that is always left to right, such as codes, emails, and passwords, stays left to right in a right-to-left screen.
- When a source string changes under an existing message ID, update the catalog too, because some extractors keep the old text.

## Try to break it

Before you report, try to prove the work breaks this skill. Treat each principle as failing until evidence shows it holds. Screenshots prove how it looks. Only driving the product proves how it behaves: keyboard use, focus, announcements, kept input, and blocked double submits.

1. Write each attack as a hypothesis you can fail: what you suspect is broken, what you did, what you expected, and what you saw. "It looks fine" is not an attack.
2. Feed it the states its maker didn't design for: no data, one item, a thousand items, the longest name and translation, a slow or failed request, and a user without permission.
3. Run the tests the principles name: remove each element, blur the screenshot, finish the task with only the keyboard, enter boundary values, and repeat the task in each locale, direction, and theme.
4. When the change is risky, give the screenshots, the interaction evidence, and this skill to a judge model from a different family than the one that built the work, or to the judge your setup names. Leave out your reasoning, so your view doesn't anchor it. A change is risky when it adds a shared piece, a new flow, or more than one screen, or when it touches money, sign-in, or data loss. Ask the judge to find violations, not to approve, and to predict what each action does from its label alone, then compare that with what the action really does.
5. Retest every fix the same way. When you reject a finding, send the evidence back to the judge in a new round, and stop when it agrees or names what would change its mind.

Report each attack that found something, what you changed, and each finding you rejected with its evidence.
