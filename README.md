# Daily Project Checklist Agent

A Copilot Studio agent that helps you build and manage your daily project checklist by aggregating tasks from **Notion** and **Microsoft Planner**.

## Features

- **Unified Daily Checklist**: Combines tasks from Notion, Planner, and email into one view
- **Smart Prioritization**: Tasks sorted by priority and due date
- **Cross-Platform Updates**: Mark tasks complete and sync status across all platforms
- **Real-time Sync**: Always get the latest tasks from your connected services
- **Natural Language Interface**: Just ask for your checklist in plain English
- **Email-to-Task Agent**: Automatically creates Notion tasks from flagged Outlook emails

## Project Structure

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
│   ├── monitor-email-tasks.topic.yaml  # Email monitoring & email-sourced tasks
│   └── fallback.topic.yaml
├── connections/               # Connection references
│   ├── notion-connection.json
│   ├── planner-connection.json
│   └── email-connection.json           # Microsoft 365 Outlook connection
└── flows/                     # Power Automate flows
    ├── fetch-notion-tasks.flow.json
    ├── fetch-planner-tasks.flow.json
    ├── update-task-status.flow.json
    └── create-notion-task-from-email.flow.json  # Email-to-Notion automation
```

## Setup Instructions

### Prerequisites

- Microsoft 365 account with Planner and Outlook access
- Notion account with API access
- Copilot Studio license

### 1. Notion Setup

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the **Internal Integration Token**
4. In your tasks database, click **...** > **Add connections** > Select your integration
5. Copy the **Database ID** from the URL (32-character string)

### 2. Microsoft Planner Setup

1. Sign in to Copilot Studio with your Microsoft 365 account
2. The Planner connection will use your existing Microsoft 365 authentication
3. Identify the Plan ID(s) you want to connect (optional - agent can show all your tasks)

### 3. Email Monitoring Setup

1. The Outlook connection reuses your existing Microsoft 365 authentication
2. Grant `Mail.Read` and `Mail.ReadWrite` permissions when prompted in Power Automate
3. In `settings.json`, confirm `emailMonitoring.enabled` is `true`
4. Add a **Source** property (Select type) to your Notion tasks database if it doesn't exist
5. Add a **From** property (Text type) and **Email Link** property (URL type) to the database
6. Add a **Received** property (Date type) for the email received timestamp
7. The flow polls every 5 minutes — adjust `pollIntervalMinutes` in `settings.json` as needed

**To create a task from email:** Simply flag any email in Outlook (desktop, web, or mobile).

### 5. Deploy to Copilot Studio

1. Import the agent manifest into Copilot Studio
2. Configure the connection references with your credentials
3. Import and enable the Power Automate flows (including the new email flow)
4. Test the agent in the test pane
5. Publish when ready

## Usage Examples

**Build your checklist:**
- "Build my daily checklist"
- "What do I need to do today?"
- "Show my tasks"

**View specific sources:**
- "Show my Notion tasks"
- "View Planner tasks"
- "What's in my plan?"

**Manage tasks:**
- "Mark a task complete"
- "Update task status"
- "Check off a task"

**Check connections:**
- "Sync status"
- "Check connection status"
- "Are my integrations working?"

**Email monitoring:**
- "Show email tasks"
- "Tasks from email"
- "Email monitoring status"
- "How does email monitoring work?"

## Configuration

Edit `settings.json` to customize:

- **Task status mapping**: Map your Notion/Planner statuses to standard states
- **Default views**: Choose combined, by-source, or priority-based views
- **Sync settings**: Configure real-time or scheduled sync
- **Timezone**: Set your local timezone for daily resets

## Customization

### Adding Custom Properties

To track additional task properties, modify the flow definitions:

1. Update `fetch-notion-tasks.flow.json` to include new Notion properties
2. Update `fetch-planner-tasks.flow.json` for Planner fields
3. Modify the topic files to display the new data

### Adding More Task Sources

The architecture supports additional integrations:

1. Create a new connection reference in `connections/`
2. Add a new flow in `flows/` to fetch tasks
3. Create a topic for the new source
4. Update `build-daily-checklist.topic.yaml` to include the new source

## Troubleshooting

### Notion Connection Issues
- Verify your integration token is correct
- Ensure the integration has access to the database
- Check that the database ID is the correct 32-character string

### Planner Connection Issues
- Re-authenticate with your Microsoft 365 account
- Verify you have access to the specified plan
- Check Graph API permissions

### No Tasks Showing
- Verify tasks exist in your connected databases/plans
- Check the status filters in settings
- Ensure tasks have due dates set (if filtering by due date)

## License

MIT License - See LICENSE file for details
