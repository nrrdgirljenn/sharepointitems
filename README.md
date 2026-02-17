# Copilot Studio Agents

A collection of Copilot Studio agents built for Microsoft 365 environments.

---

## Copilot Email Agent

A Copilot Studio agent that **documents incoming emails to SharePoint** and **automatically replies** to senders using configurable rules and templates.

### Features

- **Email Documentation**: Every incoming email is automatically logged to a SharePoint list with full metadata (sender, subject, body preview, attachments, timestamps)
- **Auto-Reply**: Sends a context-aware acknowledgement reply to every email within 1 minute of receipt
- **Rule Engine**: Configurable rules match emails by subject keywords and route them to specific reply templates
- **Excluded Sender Handling**: Skips auto-replies for no-reply/mailer-daemon addresses to prevent reply loops
- **Conversation Interface**: Manage all settings through natural language in the Copilot Studio chat pane

### Project Structure

```
src/email-agent/
├── manifest.json                        # Agent manifest and configuration
├── settings.json                        # Email, auto-reply, and rule settings
├── connections/
│   ├── outlook-connection.json          # Office 365 Outlook connection reference
│   └── sharepoint-connection.json       # SharePoint Online connection + list schema
├── flows/
│   ├── process-incoming-email.flow.json # Trigger: new email → log to SharePoint → send reply
│   ├── get-email-log.flow.json          # Called by agent to browse the email log
│   └── update-reply-template.flow.json  # Called by agent to update templates and rules
└── topics/
    ├── welcome.topic.yaml               # Greeting and main menu
    ├── configure-auto-reply.topic.yaml  # Update reply templates, toggle on/off
    ├── view-email-log.topic.yaml        # Browse and filter logged emails
    ├── email-summary.topic.yaml         # Stats on recent email activity
    ├── manage-email-rules.topic.yaml    # Add, update, or disable routing rules
    └── fallback.topic.yaml              # Handle unrecognized input
```

### Prerequisites

- Microsoft 365 account with an Outlook mailbox to monitor
- SharePoint Online site with permission to create lists
- Copilot Studio license (Microsoft 365 Copilot or standalone)
- Power Automate Premium (for the custom connector triggers)

### Setup

#### 1. Create the SharePoint EmailLog list

1. Navigate to your SharePoint site
2. Create a new list named **EmailLog**
3. Add columns as defined in `connections/sharepoint-connection.json` under `sharePointListSchema`
4. Create a second list named **EmailAgentConfig** with columns: `Title` (Text), `DefaultReplyTemplate` (Note), `AutoReplyEnabled` (Boolean), `LastModified` (Date/Time)
5. Add one item to **EmailAgentConfig** with `Title = DefaultConfig`

#### 2. Configure connection references

1. Open `settings.json` and set `emailSettings.documentation.sharePointSiteUrl` to your SharePoint site URL
2. Open `connections/sharepoint-connection.json` and update `configuration.siteUrl`

#### 3. Import connections in Copilot Studio

1. Go to **Settings > Connections** in Copilot Studio
2. Add **Office 365 Outlook** — sign in with the mailbox you want to monitor
3. Add **SharePoint** — sign in with an account that has write access to the EmailLog list

#### 4. Import and configure flows

1. Import `process-incoming-email.flow.json` into Power Automate
2. Update the flow parameters: `sharePointSiteUrl` and `sharePointListName`
3. Set `autoReplyEnabled = true` and update `defaultReplyTemplate` as needed
4. Import `get-email-log.flow.json` and `update-reply-template.flow.json`
5. Enable all three flows

#### 5. Deploy the agent

1. Import `src/email-agent/manifest.json` into Copilot Studio
2. Map the connection references to your configured connections
3. Register the three flows as agent actions
4. Test in the test pane
5. Publish when ready

### Usage Examples

**View logged emails:**
- "View email log"
- "Show me emails from the last 7 days"
- "What emails came in today?"

**Get a summary:**
- "Email summary"
- "How many emails did I get this week?"
- "Show support request stats"

**Configure auto-reply:**
- "Update my auto-reply template"
- "Turn off auto-reply"
- "Enable auto-reply"

**Manage rules:**
- "Show my email rules"
- "Add a new rule"
- "Disable a rule"

### How the Auto-Reply Rule Engine Works

Rules are stored in `settings.json` and evaluated in priority order:

| Priority | Rule Name | Trigger Condition | Reply Template |
|----------|-----------|-------------------|----------------|
| 1 | Support Requests | Subject contains: support, help, issue, problem | Support acknowledgement with ticket reference |
| 99 | General Inquiries | All other emails (catch-all) | Default acknowledgement |

Rules can be managed through the agent's conversation interface or by editing `settings.json` directly.

### Troubleshooting

**Emails not being logged:**
- Check that the Power Automate flow `process-incoming-email` is enabled and running
- Verify the Outlook connection is authenticated
- Confirm the SharePoint list name matches `sharePointListName` in the flow

**Auto-replies not sending:**
- Check `autoReplyEnabled` is `true` in the flow parameters
- Verify the sender is not on the excluded list (noreply, donotreply, etc.)
- Check the Outlook connection has `Mail.Send` permission

**SharePoint items not created:**
- Confirm the SharePoint connection has write access to the list
- Verify all required columns exist in the EmailLog list (see `sharepoint-connection.json`)
- Check Power Automate run history for detailed error messages

---

## Daily Project Checklist Agent

A Copilot Studio agent that helps you build and manage your daily project checklist by aggregating tasks from **Notion** and **Microsoft Planner**.

### Features

- **Unified Daily Checklist**: Combines tasks from Notion and Planner into one view
- **Smart Prioritization**: Tasks sorted by priority and due date
- **Cross-Platform Updates**: Mark tasks complete and sync status across both platforms
- **Real-time Sync**: Always get the latest tasks from your connected services
- **Natural Language Interface**: Just ask for your checklist in plain English

### Project Structure

```
src/agent/
├── manifest.json              # Agent manifest and configuration
├── settings.json              # Agent settings
├── topics/                    # Conversation topics
│   ├── welcome.topic.yaml     # Welcome and greeting flow
│   ├── get-notion-tasks.topic.yaml
│   ├── get-planner-tasks.topic.yaml
│   ├── build-daily-checklist.topic.yaml
│   ├── manage-checklist.topic.yaml
│   ├── sync-status.topic.yaml
│   └── fallback.topic.yaml
├── connections/               # Connection references
│   ├── notion-connection.json
│   └── planner-connection.json
└── flows/                     # Power Automate flows
    ├── fetch-notion-tasks.flow.json
    ├── fetch-planner-tasks.flow.json
    └── update-task-status.flow.json
```

### Setup Instructions

See `docs/SETUP_GUIDE.md` for the full step-by-step setup guide.

**Prerequisites:**
- Microsoft 365 account with Planner access
- Notion account with API access
- Copilot Studio license

### Usage Examples

**Build your checklist:**
- "Build my daily checklist"
- "What do I need to do today?"
- "Show my tasks"

**View specific sources:**
- "Show my Notion tasks"
- "View Planner tasks"

**Manage tasks:**
- "Mark a task complete"
- "Update task status"

---

## License

MIT License - See LICENSE file for details
