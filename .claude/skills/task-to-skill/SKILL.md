---
name: task-to-skill
description: Turns any repeated manual task into a reusable one-word Claude Code skill. Describe what you keep doing manually and this skill creates a SKILL.md so you never have to explain it again.
triggers:
  - /task-to-skill
  - turn this into a skill
  - make this a skill
  - save this as a skill
  - create a skill for
---

# Task to Skill

Convert a repeated manual task into a reusable Claude Code skill. After this runs, the user can trigger the entire workflow with a single `/command` — no prompt, no setup.

## How to Use

```
/task-to-skill "<describe the task you keep repeating>"
```

Examples:
- `/task-to-skill "every Monday I ask you to pull Planner tasks, write a sprint summary, and post a Notion update"`
- `/task-to-skill "I always ask you to review new topic YAML files for correctness before I deploy"`
- `/task-to-skill "I regularly need a status report comparing open Notion tasks vs Planner tasks"`

## Steps

1. **Understand the task** — extract these details from the user's description (ask if anything is unclear):
   - **Trigger**: what causes this task to happen? (time, event, user action)
   - **Inputs**: what data or files does it need? (project files, MCP tools, user-provided text)
   - **Output**: what is produced? (email, document, code, report, updated task)
   - **Tools**: which MCP servers or integrations are used?
   - **Edge cases**: what can go wrong or vary?

2. **Choose a skill name** — short, lowercase, hyphenated, verb-first:
   - Good: `weekly-sprint-summary`, `draft-status-email`, `sync-notion-planner`, `review-topic-yaml`
   - Bad: `My Task`, `the thing I do on Fridays`, `skill1`

3. **Write the SKILL.md** at `.claude/skills/<skill-name>/SKILL.md` using this template:

```markdown
---
name: [skill-name]
description: [One sentence: what this skill does and when to use it.]
triggers:
  - /[skill-name]
  - [natural language trigger phrase]
  - [another trigger phrase]
---

# [Skill Name]

[One paragraph explaining what this skill does and why it exists.]

## Steps

1. **[Step name]** — [what to do and how]
2. **[Step name]** — [what to do and how]
3. **[Step name]** — [what to do and how]

## Expected Output

[Describe exactly what the user receives at the end.]

## Notes
- [Important caveat or edge case]
- [Another note]
```

4. **Confirm with the user** — after writing the file, show:
   - The file path created
   - The trigger command (e.g., `/weekly-sprint-summary`)
   - One sentence describing what it does
   - Ask if they want to adjust anything or run it immediately

## Notes
- Always create skills in `.claude/skills/` (project-level) so they travel with the repo.
- If the user asks for a global skill, create it in `~/.claude/skills/` instead and note the difference.
- After creating the skill, offer to run it immediately so the user can verify it works.
- If the task involves API keys or tokens, add a note in the skill to read them from environment variables — never hardcode credentials in skill files.
