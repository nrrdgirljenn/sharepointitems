---
name: parallel-workers
description: Spawns three sub-agents simultaneously — researcher, drafter, and editor — then combines their outputs into a polished result. Use for any task that benefits from speed and multiple perspectives.
triggers:
  - /parallel-workers
  - run parallel workers
  - use parallel agents
  - spawn agents for
---

# Parallel Workers

Orchestrate three parallel sub-agents to complete a task simultaneously. This produces higher-quality output faster than sequential processing because each agent focuses on a single role without context-switching.

## How to Use

```
/parallel-workers <task description>
```

Examples:
- `/parallel-workers write a sprint update email for the Planner review`
- `/parallel-workers create a Notion page summarising this week's completed tasks`
- `/parallel-workers draft a README section explaining the Notion–Planner sync flow`

## Steps

1. **Parse the task** — identify the desired output (email, document, code, analysis, etc.) and any relevant context in the current project.

2. **Define roles** for this specific task:
   - **Researcher** — gathers facts, context, and data from the codebase, project files, or MCP tools
   - **Drafter** — writes the first complete version of the output from scratch
   - **Editor** — reviews the draft critically for clarity, accuracy, tone, and completeness

3. **Launch all three agents in a single message** using the Agent tool so they run concurrently. Set `run_in_background: false` and include all three calls in one response block.

   Use these prompt templates:

   **Researcher**: "Research [topic] in the context of [project path/description]. Find: [specific facts or data needed]. Return a concise bullet list of findings only."

   **Drafter**: "Draft [output type] about [topic]. Context: [project context]. Write a complete, production-ready version. Do not explain what you are doing — just produce the output."

   **Editor**: "You are reviewing a draft [output type]. Draft: ---[paste draft]--- Check for: factual accuracy, clarity, completeness, and appropriate tone. Return a list of specific improvements with the corrected text inline."

4. **Synthesize** — incorporate the researcher's findings into the draft, then apply the editor's corrections to produce the final output.

5. **Present the result** with a one-line summary of the most significant change made during editing.

## Notes
- Always launch all three agents in a single response so they genuinely run in parallel.
- For code tasks: researcher reads the codebase, drafter writes the code, editor reviews for bugs and style.
- If the task clearly needs only two workers, drop the one that adds least value and say which one you dropped.
- Do not summarise the agents' intermediate outputs to the user — only show the final synthesised result.
