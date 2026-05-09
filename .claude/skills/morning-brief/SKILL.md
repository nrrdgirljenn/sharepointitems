---
name: morning-brief
description: Generates a focused daily brief by reading your calendar, Notion tasks, and Microsoft Planner tasks. Run every morning to know exactly what to focus on.
triggers:
  - /morning-brief
  - morning brief
  - what should I focus on today
  - daily brief
  - what do I need to do today
---

# Morning Brief

Generate the user's morning brief. Synthesize their calendar, Notion tasks, and Planner tasks into a focused 3–5 item priority list for the day. The entire brief should be readable in under 2 minutes.

## Steps

1. **Check the calendar** — use any available calendar MCP tool to list today's events. Note meeting times, deadlines, and any back-to-back blocks that will limit focus time.

2. **Read Notion tasks** — use the Notion MCP tool to query open tasks filtered to:
   - Due today or overdue
   - High priority
   - Status: in-progress or not started

3. **Read Microsoft Planner tasks** — use any available Microsoft 365 / Planner MCP tool to get:
   - Tasks assigned to me
   - Due today or overdue
   - Not yet completed

4. **Synthesize the brief** — combine all data into this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MORNING BRIEF — [Day, Month Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 CALENDAR TODAY
  [HH:MM] [Event name]
  [HH:MM] [Event name]

🔴 MUST DO  (top 3)
  1. [Task — source (Notion/Planner) — why urgent]
  2. [Task — source]
  3. [Task — source]

🟡 SHOULD DO
  • [Additional tasks if time allows]

⚠️  WATCH OUT
  • [Blockers, conflicts, overdue items, or risks]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

5. **Flag conflicts** — if a high-priority task needs deep focus time but the calendar is packed with meetings, call that out explicitly in WATCH OUT.

## Notes
- If a data source is unavailable, note it and continue with what is accessible.
- Prioritize tasks that are overdue or blocking other people.
- Never fabricate task data — only report what the tools actually return.
