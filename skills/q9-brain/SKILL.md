---
name: q9-brain
user-invocable: true
disable-model-invocation: false
description: Use when reading or writing the Q9 Brain, before asking Hasan a question or stating where a project, client or person stands, and whenever Hasan reports that something happened, decides something, or corrects a fact.
---

# Q9 Brain

## What it holds

The Brain is Q9's shared memory for Hasan and Shoaib. It copies in, as Sources, both founders' Gmail, every chat on its two WhatsApp accounts, meeting transcripts and recordings, and agents' session notes. Memories, Contacts and the Kit are built from those Sources.

- `brain` is the Q9 Assistant number, +923098673500, the Brain's own WhatsApp. It sends and receives, and team members message it.
- `q9-business` is Q9's business WhatsApp. The Brain only reads it, including client groups such as Skrooge's.

`recall` → `context` lists which inboxes and accounts are connected right now.

## Before you ask or report

Read the newest Sources on the topic before its Memories: `list` sources by `contact` or `conversation`, newest first. Chats, meeting notes and sessions change before Memories catch up. Ask Hasan only what the Brain doesn't hold.

## Saving

- Save in the same turn. Hasan's words go in first as a `chat` Source, and every Memory you change quotes it.
- Update the Memory that exists (`search`, then `memory_set`). Add one only when nothing covers it, and set `superseded_by` on what it replaces.
- When a topic is dropped or settled, close every open action on it and set `valid_until` on facts it made false.
- A title is one short sentence of current state with absolute dates, and it agrees with the body and status.

## Dictated names

Hasan dictates, so names can arrive misspelt. Match each one against Contacts and the conversation's Sources before saving it.
