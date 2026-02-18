# Copilot Studio Agents

This repository contains two Copilot Studio agents for Microsoft 365 environments.

---

## Agent 1: IT Help Desk Triage Agent

An intelligent triage agent that collects, categorizes, prioritizes, and tickets IT help desk requests. It guides users through structured intake, offers self-service troubleshooting tips, creates tickets in a SharePoint list, and auto-escalates critical issues to IT management.

### Features

- **Smart Triage Intake**: Collects issue category, description, affected users, and work-blocking status
- **Auto-Priority Assignment**: Automatically calculates Critical / High / Medium / Low priority based on impact rules
- **Category-Specific Flows**: Tailored conversation paths for Hardware, Software, Network, Account/Access, and General IT
- **Self-Service Guidance**: Offers troubleshooting steps before submitting a ticket
- **Automatic Ticket Creation**: Creates tickets in a SharePoint list with ticket number, SLA deadline, and assigned team
- **Email Confirmation**: Sends a formatted confirmation email to the user on ticket creation
- **Auto-Escalation**: For Critical issues, immediately notifies IT management via email
- **Ticket Status Lookup**: Users can check their ticket status by ticket number or email

### Triage Categories & SLAs

| Category | Assigned Team | SLA |
|---|---|---|
| 🖥️ Hardware | Hardware Team | 8 hours |
| 💻 Software / Applications | Software Team | 4 hours |
| 🌐 Network / Connectivity | Network Team | 2 hours |
| 🔐 Account / Access | Account & Access Team | 1 hour |
| ❓ General IT | General IT Team | 24 hours |

### Priority Levels

| Priority | Auto-Assigned When | SLA | Escalate? |
|---|---|---|---|
| 🔴 Critical | 10+ users affected, or network outage | 1 hour | Yes |
| 🟠 High | Cannot work + account/network issue | 2 hours | No |
| 🟡 Medium | Partial impact, workaround available | 8 hours | No |
| 🟢 Low | Minor issue, general question | 24 hours | No |

### Help Desk Agent Structure

```
src/helpdesk-agent/
├── manifest.json              # Agent manifest and configuration
├── settings.json              # Triage rules, priority settings, SLA config
├── topics/
│   ├── welcome.topic.yaml            # Greeting and main menu
│   ├── triage-intake.topic.yaml      # Core intake: name, email, category, description
│   ├── hardware-issue.topic.yaml     # Hardware-specific triage + self-service tips
│   ├── software-issue.topic.yaml     # Software/app-specific triage
│   ├── network-issue.topic.yaml      # Network/VPN triage + outage detection
│   ├── account-access-issue.topic.yaml  # Password, lockout, MFA, permissions
│   ├── ticket-status.topic.yaml      # Look up ticket by number or email
│   ├── escalation.topic.yaml         # Manual escalation to Critical
│   └── fallback.topic.yaml           # Unknown intent handler
├── connections/
│   ├── sharepoint-connection.json    # SharePoint HelpDeskTickets list
│   └── email-connection.json         # Office 365 Outlook for notifications
└── flows/
    ├── create-ticket.flow.json       # Creates ticket + sends confirmation email
    ├── get-ticket-status.flow.json   # Retrieves ticket status from SharePoint
    └── escalate-ticket.flow.json     # Escalates ticket + notifies IT management
```

### Setup Prerequisites (Help Desk Agent)

- Microsoft 365 account with SharePoint and Outlook access
- Copilot Studio license
- Power Automate (included with Microsoft 365)

### Quick Setup (Help Desk Agent)

1. **Create SharePoint list**: Create a list named `HelpDeskTickets` on your SharePoint site with the required columns (see `connections/sharepoint-connection.json` for full column list)
2. **Configure settings**: Update `settings.json` and `connections/sharepoint-connection.json` with your SharePoint site URL
3. **Update email settings**: Set your help desk email and IT manager email addresses in `settings.json`
4. **Import to Copilot Studio**: Import the `manifest.json` and create the three Power Automate flows
5. **Connect SharePoint and Outlook**: Add the connections in Copilot Studio under Settings > Connections
6. **Test and publish**: Test in the Copilot Studio test pane, then publish to Teams or your website

For full step-by-step instructions, see `docs/HELPDESK_SETUP_GUIDE.md`.

### Usage Examples (Help Desk Agent)

**Report an issue:**
- "I need IT help"
- "My computer isn't working"
- "I can't connect to VPN"
- "I'm locked out of my account"

**Check ticket status:**
- "Check ticket HD-1042"
- "What's the status of my ticket?"
- "Show my open tickets"

**Escalate:**
- "Escalate my ticket"
- "This is critical, the whole company is down"

---

## Agent 2: Daily Project Checklist Agent

A Copilot Studio agent that helps you build and manage your daily project checklist by aggregating tasks from **Notion** and **Microsoft Planner**.

## Features

- **Unified Daily Checklist**: Combines tasks from Notion and Planner into one view
- **Smart Prioritization**: Tasks sorted by priority and due date
- **Cross-Platform Updates**: Mark tasks complete and sync status across both platforms
- **Real-time Sync**: Always get the latest tasks from your connected services
- **Natural Language Interface**: Just ask for your checklist in plain English

### Daily Checklist Agent Structure

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

## Setup Instructions

### Prerequisites

- Microsoft 365 account with Planner access
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

### 3. Deploy to Copilot Studio

1. Import the agent manifest into Copilot Studio
2. Configure the connection references with your credentials
3. Import and enable the Power Automate flows
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
