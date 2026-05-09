---
name: process-backlog
description: Works through your backlog autonomously — drafts email replies, summarizes research documents, organizes files, and closes stale tasks. Run at the end of the day or before a deep-focus block so everything is ready when you return.
triggers:
  - /process-backlog
  - process my backlog
  - process backlog
  - clear my backlog
  - work through backlog
  - handle my backlog
---

# Process Backlog

Work through the user's backlog systematically and autonomously. The goal is to close or action as many items as possible without requiring user input, then present a clean report of what was done and what still needs a decision.

## Steps

1. **Survey the backlog** — collect all pending items from available sources:
   - Notion: tasks with no due date, overdue tasks, or tasks in "backlog" status
   - Microsoft Planner: tasks assigned to me with status "not started" or "in progress" past due date
   - Inbox folder or email MCP tool (if available): unread or unreplied messages
   - Any loose files or notes the user has flagged

2. **Categorize every item** into exactly one bucket:
   - 📝 **Needs a draft** — email, message, or document reply required
   - 📖 **Needs a summary** — unread document, article, or research to digest
   - 📁 **Needs organizing** — loose file, note, or task that belongs somewhere specific
   - ✅ **Can be closed now** — stale task, already completed work, or duplicate

3. **Process each category**:

   **Drafts** — write a complete draft reply. Prepend every draft with `[DRAFT — REVIEW BEFORE SENDING]`. Never send without explicit user approval.

   **Summaries** — for each document or article, produce a 3-bullet TL;DR:
   - What it says
   - What action it implies
   - Its deadline or urgency level

   **Organization** — suggest a filing location using the existing project structure. Only move or rename files if the user has explicitly granted permission to do so.

   **Closeable items** — mark tasks complete if there is clear evidence they are done. Flag tasks that have had no activity for more than 2 weeks as stale.

4. **Produce a backlog report**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKLOG PROCESSED — [Date, Time]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ CLOSED ([n] items)
  • [Task name] — [reason closed]

📝 DRAFTS READY ([n] items)
  • [Subject / title] — [2-word summary]

📖 SUMMARIES ([n] items)
  • [Doc title]: [one-line TL;DR + urgency]

📁 FILES TO ORGANIZE ([n] items)
  • [File name] → [suggested location]

⚠️  NEEDS YOUR DECISION ([n] items)
  • [Item] — [why it could not be handled automatically]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Notes
- Never send emails, post messages, or make irreversible changes without explicit user approval.
- When an item is ambiguous, add it to "Needs Your Decision" rather than guessing.
- If no backlog items are found in a category, omit that section from the report.
- Aim to handle at least 80% of items without needing user input.
