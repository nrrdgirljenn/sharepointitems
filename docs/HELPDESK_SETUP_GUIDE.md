# IT Help Desk Triage Agent — Setup Guide

This guide walks you through the complete setup of the IT Help Desk Triage Agent in Microsoft Copilot Studio.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1 — Create the SharePoint Ticket List](#2-step-1--create-the-sharepoint-ticket-list)
3. [Step 2 — Create the Copilot Studio Agent](#3-step-2--create-the-copilot-studio-agent)
4. [Step 3 — Create Power Automate Flows](#4-step-3--create-power-automate-flows)
   - [Flow A: Create Ticket](#flow-a-create-ticket)
   - [Flow B: Get Ticket Status](#flow-b-get-ticket-status)
   - [Flow C: Escalate Ticket](#flow-c-escalate-ticket)
5. [Step 4 — Create Conversation Topics](#5-step-4--create-conversation-topics)
6. [Step 5 — Configure Agent Settings](#6-step-5--configure-agent-settings)
7. [Step 6 — Test the Agent](#7-step-6--test-the-agent)
8. [Step 7 — Publish to Microsoft Teams](#8-step-7--publish-to-microsoft-teams)
9. [Troubleshooting](#9-troubleshooting)
10. [Quick Reference](#10-quick-reference)

---

## 1. Prerequisites

Before starting, make sure you have:

- [ ] **Microsoft 365 Business or Enterprise** subscription
- [ ] **Copilot Studio license** (included in Microsoft 365 E3/E5, or available as add-on)
- [ ] **SharePoint Online** access
- [ ] **Power Automate** access (included with Microsoft 365)
- [ ] **Global Admin or Power Platform Admin** role, or a user with Environment Maker role
- [ ] An email address for the help desk service account (e.g., `helpdesk@yourdomain.com`)

---

## 2. Step 1 — Create the SharePoint Ticket List

The agent stores all tickets in a SharePoint list. Complete this step first.

### 2.1 Navigate to your SharePoint site

1. Go to your SharePoint site (e.g., `https://yourtenant.sharepoint.com/sites/IT`)
2. If you don't have a dedicated IT site, create one or use any existing site

### 2.2 Create the HelpDeskTickets list

1. Click **+ New** → **List**
2. Select **Blank list**
3. Name it: `HelpDeskTickets`
4. Click **Create**

### 2.3 Add required columns

Add the following columns to the list (the **Title** column already exists — rename it to be the ticket title):

| Column Name | Column Type | Required | Notes |
|---|---|---|---|
| `TicketNumber` | Single line of text | Yes | Auto-generated (e.g., HD-1042) |
| `Description` | Multiple lines of text | Yes | Full issue description |
| `Category` | Choice | Yes | Options: Hardware, Software, Network, Account/Access, Other |
| `Priority` | Choice | Yes | Options: Critical, High, Medium, Low |
| `Status` | Choice | Yes | Options: New, Assigned, In Progress, Pending User, Resolved, Closed |
| `SubmittedBy` | Single line of text | Yes | User's display name |
| `SubmittedByEmail` | Single line of text | Yes | User's email address |
| `AssignedTeam` | Single line of text | No | Auto-populated by flow |
| `SLADeadline` | Date and Time | No | Auto-calculated by flow |
| `AffectedUsers` | Number | No | Default: 1 |
| `Resolution` | Multiple lines of text | No | Filled when ticket is resolved |
| `ResolvedDate` | Date and Time | No | Date when resolved |

> **Tip:** For the **Status** column, set the default value to `New`.

### 2.4 Copy your SharePoint site URL

Note down your SharePoint site URL — you'll need it later:
```
https://yourtenant.sharepoint.com/sites/YourSiteName
```

---

## 3. Step 2 — Create the Copilot Studio Agent

### 3.1 Open Copilot Studio

1. Navigate to [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. Sign in with your Microsoft 365 account

### 3.2 Create a new agent

1. Click **+ Create** in the left navigation
2. Select **New agent**
3. Click **Skip to configure** (to use manual setup)

### 3.3 Configure basic agent settings

Fill in the agent details:

- **Name**: `IT Help Desk`
- **Description**: `Triage and submit IT help desk requests. Get ticket status and escalate critical issues.`
- **Instructions**:
  ```
  You are an IT Help Desk Triage Agent. Your job is to:
  1. Greet the user and identify their IT issue
  2. Collect all necessary details: name, email, category, description, and impact
  3. Guide users through self-service troubleshooting where appropriate
  4. Create a support ticket and confirm the details
  5. Auto-escalate Critical priority tickets to IT management
  6. Help users check the status of existing tickets

  Always be professional, empathetic, and efficient. Prioritize getting users unblocked quickly.
  ```
- **Language**: English (or your preferred language)

### 3.4 Disable "Allow the AI to use its own general knowledge"

For a help desk agent, you want structured flows — not open-ended AI responses. In **Settings > Generative AI**, turn off **Allow the AI to use its own general knowledge** unless you want the agent to answer general IT questions using generative AI.

---

## 4. Step 3 — Create Power Automate Flows

You need to create three Power Automate flows. Each flow is triggered by the Copilot Studio agent.

### Flow A: Create Ticket

This flow creates a new ticket in SharePoint and sends a confirmation email.

#### Create the flow

1. In Copilot Studio, go to your agent → **Topics** → Open any topic
2. In the topic canvas, click **+** to add a node → **Call an action** → **Create a flow**
3. This opens Power Automate in a new tab

#### Configure the trigger

1. The trigger is already set to **Run a flow from Copilot**
2. Add the following **input parameters** by clicking **Add an input**:

| Parameter Name | Type |
|---|---|
| `userName` | Text |
| `userEmail` | Text |
| `title` | Text |
| `description` | Text |
| `category` | Text |
| `priority` | Text |
| `affectedUsers` | Number |

#### Build the flow actions

**Action 1: Initialize variables**
- Add action: **Initialize variable** (repeat for each variable)
  - `varTicketNumber` — String — empty
  - `varSuccess` — Boolean — false
  - `varSlaHours` — Integer — 24
  - `varAssignedTeam` — String — "General IT Team"

**Action 2: Set SLA and team based on category**
- Add action: **Switch**
- **On**: `category` (from trigger)
- Add cases for: Hardware (8h), Software (4h), Network (2h), Account/Access (1h)

**Action 3: Override SLA for Critical**
- Add action: **Condition**
- If `priority` equals `Critical`: set `varSlaHours` to 1

**Action 4: Calculate SLA deadline**
- Add action: **Compose**
- Inputs: `addHours(utcNow(), variables('varSlaHours'))`

**Action 5: Get ticket count (for ticket number)**
- Add action: **Get items** (SharePoint)
- Site: your SharePoint site URL
- List Name: `HelpDeskTickets`
- Top Count: 1
- Order By: `Created desc`

**Action 6: Create ticket in SharePoint**
- Add action: **Create item** (SharePoint)
- Site Address: your SharePoint site URL
- List Name: `HelpDeskTickets`
- Map all fields to the trigger inputs
- `TicketNumber`: use an expression to generate: `concat('HD-', string(add(body('Get_items')?['value']?[0]?['ID'], 1)))`
- `Status`: New
- `SLADeadline`: output from Compose action

**Action 7: Send confirmation email**
- Add action: **Send an email (V2)** (Office 365 Outlook)
- To: `userEmail` from trigger
- Subject: `Help Desk Ticket Created: [TicketNumber]`
- Body: Use the HTML template from `connections/email-connection.json`

**Action 8: Return values to Copilot**
- Add action: **Return value(s) to Power Virtual Agents**
- Add outputs: `ticketNumber`, `ticketId`, `slaDeadline`, `assignedTeam`, `success`, `errorMessage`

**Save and name the flow**: `Create Help Desk Ticket`

---

### Flow B: Get Ticket Status

This flow retrieves ticket information from SharePoint.

#### Create the flow

1. Follow the same steps to create a new flow from Copilot Studio
2. **Trigger inputs**:
   - `ticketNumber` — Text (optional)
   - `userEmail` — Text (optional)

#### Build the flow actions

**Action 1: Condition — check if ticket number provided**

**If yes (look up by ticket number):**
- Add action: **Get items** (SharePoint) with filter: `TicketNumber eq 'ticketNumber'`
- Condition: check if items found
- If found: Return the first item's fields
- If not found: Return `found: false` with error message

**If no (look up by user email):**
- Add action: **Get items** (SharePoint) with filter: `SubmittedByEmail eq 'userEmail' and Status ne 'Closed'`
- Return the full array of items

**Return values**: `found`, `ticketNumber`, `title`, `status`, `priority`, `category`, `assignedTeam`, `createdDate`, `slaDeadline`, `resolution`, `allTickets`, `errorMessage`

**Save and name the flow**: `Get Ticket Status`

---

### Flow C: Escalate Ticket

This flow updates a ticket's priority and sends an urgent email to IT management.

#### Create the flow

1. Follow the same steps to create a new flow from Copilot Studio
2. **Trigger inputs**:
   - `ticketNumber` — Text
   - `ticketId` — Text
   - `userName` — Text
   - `userEmail` — Text
   - `title` — Text
   - `description` — Text
   - `category` — Text
   - `priority` — Text
   - `affectedUsers` — Number
   - `escalationReason` — Text

#### Build the flow actions

**Action 1: Set SLA hours** — 1 hour for Critical, 2 hours for High

**Action 2: Calculate new SLA deadline** — `addHours(utcNow(), varSlaHours)`

**Action 3: Update item in SharePoint**
- Action: **Update item** (SharePoint)
- ID: `ticketId` from trigger
- `Priority`: from trigger
- `Status`: Assigned
- `SLADeadline`: new calculated deadline

**Action 4: Send escalation email**
- To: IT Manager email address
- CC: IT management group email
- Subject: `🚨 ESCALATION - [priority] Priority: [ticketNumber] - [title]`
- Body: Use the HTML template from `connections/email-connection.json`
- Importance: High

**Return values**: `success`, `newSlaDeadline`, `errorMessage`

**Save and name the flow**: `Escalate Help Desk Ticket`

---

## 5. Step 4 — Create Conversation Topics

Import or manually recreate each of the 9 topics from `src/helpdesk-agent/topics/`. Below is a summary of each topic.

### Topics Overview

| Topic File | Trigger | Purpose |
|---|---|---|
| `welcome.topic.yaml` | Conversation Start | Greet user, show main menu |
| `triage-intake.topic.yaml` | "I need help", "Report issue" | Collect name, email, category, description, impact |
| `hardware-issue.topic.yaml` | "Hardware issue", "Computer broken" | Hardware-specific triage + restart tip |
| `software-issue.topic.yaml` | "Software issue", "App not working" | App-specific triage + error message capture |
| `network-issue.topic.yaml` | "Network issue", "Can't connect" | Network triage + outage fast-track |
| `account-access-issue.topic.yaml` | "Locked out", "Password reset" | Account/MFA/permissions triage |
| `ticket-status.topic.yaml` | "Check ticket status" | Look up by ticket number or email |
| `escalation.topic.yaml` | "Escalate", "Critical issue" | Manual escalation to Critical |
| `fallback.topic.yaml` | Unknown Intent | Redirect to main menu |

### Creating topics in Copilot Studio

For each topic:
1. Go to **Topics** → **+ Add a topic** → **From blank**
2. Enter the topic name and trigger phrases from the corresponding `.yaml` file
3. Build the conversation flow using the nodes described in the YAML file
4. Connect flow actions to the Power Automate flows you created in Step 3

### Key topic flows to implement

#### Welcome topic
- Trigger: Conversation Start
- Show welcome message
- Display Quick Replies: "Report an issue", "Check ticket status", "What can you help with?"
- Route to appropriate topic based on selection

#### Triage Intake topic
- Ask for: Name → Email → Category (choice) → Summary → Description → Affected users → Can't work?
- Set variable: `autoPriority` (calculated from rules)
- Show summary → Confirm → Route to category-specific topic

#### Category topics (Hardware, Software, Network, Account/Access)
- Ask 1–2 category-specific questions
- Offer self-service tips where relevant
- Call **Create Ticket** flow with all collected data
- Show ticket confirmation (number, SLA, team)
- Send to fallback options

#### Ticket Status topic
- Ask for ticket number or email
- Call **Get Ticket Status** flow
- Display results in a table format

#### Escalation topic
- Ask for ticket number + escalation reason
- Confirm escalation action
- Call **Escalate Ticket** flow
- Confirm escalation success

---

## 6. Step 5 — Configure Agent Settings

### 6.1 Update placeholder values

Search for and replace all placeholder values in the source files:

| Placeholder | Replace With |
|---|---|
| `{YOUR_SHAREPOINT_SITE_URL}` | Your SharePoint site URL |
| `{YOUR_DOMAIN}` | Your email domain (e.g., `contoso.com`) |
| `{YOUR_TENANT_ID}` | Your Azure AD tenant ID |
| `{YOUR_CLIENT_ID}` | Your app registration client ID |
| `{YOUR_HELPDESK_PHONE}` | Your IT help desk phone number |

### 6.2 Connections setup

In Copilot Studio:
1. Go to **Settings** → **Connections**
2. Add a **SharePoint** connection → Sign in with Microsoft 365 account
3. Add an **Office 365 Outlook** connection → Sign in with the help desk service account

### 6.3 Customize priority rules (optional)

In `settings.json`, edit the `priorityAutoAssignment.rules` section to match your organization's escalation policies.

### 6.4 Customize SLA times (optional)

In `settings.json`, edit the `categories` array to change SLA hours per category.

---

## 7. Step 6 — Test the Agent

### 7.1 Test in Copilot Studio

1. Open the agent in Copilot Studio
2. Click **Test** in the upper right
3. Type `Hello` to start

### 7.2 Test each scenario

Run through the following test cases:

- [ ] **Happy path**: Report a software issue → confirm ticket created → receive email
- [ ] **Hardware restart tip**: Report a hardware issue, say "No" to restart → confirm ticket created
- [ ] **Network outage**: Report a network issue affecting 10+ people → confirm escalation email sent
- [ ] **Account lockout**: Report an account lockout → confirm High priority ticket with 1-hour SLA
- [ ] **Ticket status**: Look up a created ticket by number → see status details
- [ ] **Manual escalation**: Escalate an existing ticket → confirm IT management email sent
- [ ] **Fallback**: Type something unrelated → see graceful redirect to options

### 7.3 Verify SharePoint list

After each test, check the SharePoint `HelpDeskTickets` list to confirm:
- Tickets are being created with correct fields
- Ticket numbers are generating correctly (HD-XXXX format)
- SLA deadlines are calculated correctly

---

## 8. Step 7 — Publish to Microsoft Teams

### 8.1 Publish the agent

1. In Copilot Studio, click **Publish** in the top navigation
2. Click **Publish** to make the latest version available

### 8.2 Add to Microsoft Teams

1. In Copilot Studio, go to **Channels**
2. Select **Microsoft Teams**
3. Click **Turn on Teams**
4. Follow the prompts to submit the app to the Teams Admin Center

### 8.3 Make available to users

**Option A — Allow users to install the bot individually:**
1. In Teams Admin Center, go to **Teams apps** → **Manage apps**
2. Find your agent and set the availability to **Allowed**
3. Users can find and install it from the Teams app store

**Option B — Pre-install for all users:**
1. In Teams Admin Center, go to **Teams apps** → **Setup policies**
2. Edit the **Global (Org-wide default)** policy
3. Under **Installed apps**, add your Help Desk agent
4. Under **Pinned apps**, optionally pin it to the Teams sidebar

---

## 9. Troubleshooting

### Ticket not being created

- Check the Power Automate flow run history for errors
- Verify the SharePoint site URL in the flow matches exactly (no trailing slash)
- Confirm the SharePoint connection in the flow has the correct account
- Ensure all required columns exist in the SharePoint list

### Email not being sent

- Check the Office 365 Outlook connection in Power Automate
- Verify the "To" address is a valid email
- Check your organization's email send limits
- Ensure the service account has permission to send mail

### Escalation email not reaching IT manager

- Double-check the IT manager email address in `settings.json` and the escalation flow
- Check spam/junk filters
- Verify the email connection has Send permissions

### Agent not routing to correct topic

- Check trigger phrases in each topic for conflicts
- Ensure the welcome topic is set as the Conversation Start trigger
- Verify the fallback topic is set as the Unknown Intent trigger

### SLA deadline shows wrong timezone

- Power Automate uses UTC by default
- Wrap `utcNow()` with `convertTimeZone()` to convert to your local timezone:
  ```
  convertTimeZone(addHours(utcNow(), variables('varSlaHours')), 'UTC', 'Eastern Standard Time')
  ```

---

## 10. Quick Reference

### Ticket number format
`HD-XXXX` (e.g., HD-1042, HD-1043)

### Environment variables to configure

```
SHAREPOINT_SITE_URL = https://yourtenant.sharepoint.com/sites/IT
HELPDESK_EMAIL = helpdesk@yourdomain.com
IT_MANAGER_EMAIL = it-manager@yourdomain.com
IT_MANAGER_GROUP = it-management@yourdomain.com
HELPDESK_PHONE = +1-555-123-4567
```

### SLA Reference

| Priority | SLA | Auto-Escalate |
|---|---|---|
| Critical | 1 hour | ✅ Yes |
| High | 2 hours | No |
| Medium | 8 hours | No |
| Low | 24 hours | No |

### SharePoint List URL format

```
https://yourtenant.sharepoint.com/sites/IT/Lists/HelpDeskTickets
```

### Power Automate flows required

1. `Create Help Desk Ticket`
2. `Get Ticket Status`
3. `Escalate Help Desk Ticket`

---

*For questions or issues with this setup guide, open an issue in the repository.*
