# team-room

A Team pane for talking with your other Claude sessions.

- `/team` opens a pane titled "Team". It lists every message this session sends to or gets from your other sessions: who, the first line, and the time, newest on top.
- `/standup` asks each of your other running sessions for a one-line update ("what you finished, what's next"). Each reply shows at the top of the Team pane as it comes in, with "waiting…" beside anyone who has not answered yet.

The pane's history is kept in session state, so it survives the mod reloading.
