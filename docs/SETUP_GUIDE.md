# Complete Setup Guide: Daily Project Checklist Agent

This guide walks you through every step to set up your Daily Project Checklist Agent in Copilot Studio.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Create the Agent in Copilot Studio](#2-create-the-agent-in-copilot-studio)
3. [Set Up Notion Integration](#3-set-up-notion-integration)
4. [Set Up Microsoft Planner Connection](#4-set-up-microsoft-planner-connection)
5. [Create Power Automate Flows](#5-create-power-automate-flows)
6. [Create Conversation Topics](#6-create-conversation-topics)
7. [Connect Flows to Topics](#7-connect-flows-to-topics)
8. [Test Your Agent](#8-test-your-agent)
9. [Publish Your Agent](#9-publish-your-agent)

---

## 1. Prerequisites

Before you begin, ensure you have:

- [ ] A Microsoft 365 work or school account
- [ ] Access to Copilot Studio (https://copilotstudio.microsoft.com)
- [ ] Access to Power Automate (https://make.powerautomate.com)
- [ ] A Notion account with at least one database for tasks
- [ ] Microsoft Planner with at least one plan created

---

## 2. Create the Agent in Copilot Studio

### Step 2.1: Access Copilot Studio

1. Open your web browser
2. Go to **https://copilotstudio.microsoft.com**
3. Sign in with your Microsoft 365 account
4. Select your environment (or use the default)

### Step 2.2: Create a New Agent

1. Click **+ Create** in the left sidebar
2. Select **New agent**
3. In the "Describe your agent" box, type:
   ```
   An agent that helps users build and manage their daily project checklist
   by pulling tasks from Notion and Microsoft Planner
   ```
4. Click **Create**

### Step 2.3: Configure Basic Settings

1. Once created, click on the agent name at the top
2. Click **Edit** next to the name
3. Set the following:
   - **Name**: `Daily Project Checklist Agent`
   - **Description**: `Helps you stay organized by aggregating tasks from Notion and Microsoft Planner into a unified daily checklist`
4. Click **Save**

### Step 2.4: Configure Agent Settings

1. Click **Settings** (gear icon) in the top right
2. Go to **Generative AI**
3. Enable the following:
   - [x] **Generative answers** - Allow the agent to use AI to answer questions
   - [x] **Generative actions** - Allow the agent to suggest actions
4. Click **Save**

---

## 3. Set Up Notion Integration

### Step 3.1: Create a Notion Integration

1. Open a new browser tab
2. Go to **https://www.notion.so/my-integrations**
3. Sign in to your Notion account
4. Click **+ New integration**
5. Fill in the details:
   - **Name**: `Daily Checklist Agent`
   - **Associated workspace**: Select your workspace
   - **Type**: Keep as "Internal"
6. Click **Submit**

### Step 3.2: Copy Your Integration Token

1. On the integration page, find **Internal Integration Secret**
2. Click **Show** then **Copy**
3. **SAVE THIS TOKEN** somewhere secure (you'll need it later)
   - It looks like: `secret_ABC123xyz...`

### Step 3.3: Set Integration Capabilities

1. Scroll down to **Capabilities**
2. Ensure these are checked:
   - [x] Read content
   - [x] Update content
   - [x] Insert content
3. Click **Save changes**

### Step 3.4: Connect Integration to Your Database

1. Open Notion in another tab
2. Navigate to your **Tasks database** (or create one)
3. Click the **•••** menu in the top right of the database
4. Scroll down and click **+ Add connections**
5. Search for and select **Daily Checklist Agent** (your integration)
6. Click **Confirm**

### Step 3.5: Get Your Database ID

1. Open your tasks database in Notion
2. Look at the URL in your browser. It looks like:
   ```
   https://www.notion.so/yourworkspace/abc123def456...?v=xyz
   ```
3. The **Database ID** is the 32-character string after your workspace name
   - Example: `abc123def456ghi789jkl012mno345pq`
4. **SAVE THIS ID** (you'll need it later)

### Step 3.6: Ensure Your Database Has Required Properties

Your Notion database should have these properties (create them if missing):

| Property Name | Property Type | Purpose |
|--------------|---------------|---------|
| Name (or Title) | Title | Task name |
| Status | Status | Task status (To Do, In Progress, Done) |
| Due Date | Date | When the task is due |
| Priority | Select | Priority level (High, Medium, Low) |

---

## 4. Set Up Microsoft Planner Connection

### Step 4.1: Verify Planner Access

1. Go to **https://tasks.office.com**
2. Sign in with your Microsoft 365 account
3. Verify you can see your plans and tasks
4. Note down a **Plan name** you want to use

### Step 4.2: Get Your Plan ID (Optional)

If you want to connect to a specific plan:

1. Open Microsoft Planner
2. Click on the plan you want to use
3. Look at the URL:
   ```
   https://tasks.office.com/yourorg/Home/Planner/#/plantaskboard?groupId=xxx&planId=ABC123
   ```
4. Copy the **planId** value (after `planId=`)
5. **SAVE THIS ID** (optional - agent can show all your tasks)

---

## 5. Create Power Automate Flows

You need to create 3 flows. Follow these steps for each.

### Step 5.1: Access Power Automate

1. Open **https://make.powerautomate.com**
2. Sign in with your Microsoft 365 account
3. Select the same environment as Copilot Studio

---

### Step 5.2: Create Flow #1 - Fetch Notion Tasks

#### 5.2.1: Start the Flow

1. Click **+ Create** in the left sidebar
2. Select **Instant cloud flow**
3. Name it: `Fetch Notion Tasks`
4. Under "Choose how to trigger this flow", select **Manually trigger a flow**
5. Click **Create**

#### 5.2.2: Add Input Parameters

1. Click on the **Manually trigger a flow** trigger
2. Click **+ Add an input**
3. Select **Text** and name it: `databaseId`
4. Click **+ Add an input** again
5. Select **Text** and name it: `filterStatus`

#### 5.2.3: Add HTTP Action for Notion API

1. Click **+ New step**
2. Search for **HTTP** and select the **HTTP** action (Premium)
3. Configure it:
   - **Method**: `POST`
   - **URI**: `https://api.notion.com/v1/databases/@{triggerBody()['databaseId']}/query`
   - **Headers**:
     | Key | Value |
     |-----|-------|
     | Authorization | Bearer YOUR_NOTION_TOKEN |
     | Notion-Version | 2022-06-28 |
     | Content-Type | application/json |
   - **Body**:
     ```json
     {
       "filter": {
         "property": "Status",
         "status": {
           "does_not_equal": "Done"
         }
       },
       "sorts": [
         {
           "property": "Due Date",
           "direction": "ascending"
         }
       ]
     }
     ```

4. Replace `YOUR_NOTION_TOKEN` with your actual Notion integration token

#### 5.2.4: Add Parse JSON Action

1. Click **+ New step**
2. Search for **Parse JSON** and select it
3. Configure it:
   - **Content**: Select **Body** from the HTTP action
   - **Schema**: Click "Generate from sample" and paste:
     ```json
     {
       "results": [
         {
           "id": "page-id",
           "properties": {
             "Name": {"title": [{"plain_text": "Task name"}]},
             "Status": {"status": {"name": "To Do"}},
             "Due Date": {"date": {"start": "2024-01-15"}},
             "Priority": {"select": {"name": "High"}}
           }
         }
       ]
     }
     ```

#### 5.2.5: Add Select Action to Transform Data

1. Click **+ New step**
2. Search for **Select** (Data Operations) and select it
3. Configure it:
   - **From**: `@body('Parse_JSON')?['results']`
   - **Map** (switch to text mode by clicking the "T" icon):
     ```json
     {
       "id": "@{item()?['id']}",
       "title": "@{first(item()?['properties']?['Name']?['title'])?['plain_text']}",
       "status": "@{item()?['properties']?['Status']?['status']?['name']}",
       "priority": "@{item()?['properties']?['Priority']?['select']?['name']}",
       "dueDate": "@{item()?['properties']?['Due Date']?['date']?['start']}",
       "source": "Notion"
     }
     ```

#### 5.2.6: Add Response Action

1. Click **+ New step**
2. Search for **Response** and select it
3. Configure it:
   - **Status Code**: `200`
   - **Body**:
     ```json
     {
       "tasks": @{body('Select')},
       "taskCount": @{length(body('Select'))},
       "success": true
     }
     ```

#### 5.2.7: Save the Flow

1. Click **Save** in the top right
2. Note down the **Flow name** for later

---

### Step 5.3: Create Flow #2 - Fetch Planner Tasks

#### 5.3.1: Start the Flow

1. Click **+ Create** > **Instant cloud flow**
2. Name it: `Fetch Planner Tasks`
3. Select **Manually trigger a flow**
4. Click **Create**

#### 5.3.2: Add Input Parameters

1. Click the trigger
2. Add input: **Text** named `planId` (optional)

#### 5.3.3: Add Planner Action - List My Tasks

1. Click **+ New step**
2. Search for **Planner** and select **List my tasks** (Microsoft Planner)
3. If prompted, sign in and authorize the connection

#### 5.3.4: Add Filter Array Action

1. Click **+ New step**
2. Search for **Filter array** (Data Operations)
3. Configure:
   - **From**: Select **value** from "List my tasks"
   - **Condition**: `@item()?['percentComplete']` is less than `100`

#### 5.3.5: Add Select Action

1. Click **+ New step**
2. Search for **Select**
3. Configure:
   - **From**: Output of Filter array
   - **Map**:
     ```json
     {
       "id": "@{item()?['id']}",
       "title": "@{item()?['title']}",
       "status": "@{if(equals(item()?['percentComplete'], 0), 'Not Started', if(equals(item()?['percentComplete'], 100), 'Completed', 'In Progress'))}",
       "priority": "@{item()?['priority']}",
       "percentComplete": "@{item()?['percentComplete']}",
       "dueDate": "@{item()?['dueDateTime']}",
       "bucketId": "@{item()?['bucketId']}",
       "planId": "@{item()?['planId']}",
       "source": "Planner"
     }
     ```

#### 5.3.6: Add Response Action

1. Click **+ New step**
2. Search for **Response**
3. Configure:
   - **Status Code**: `200`
   - **Body**:
     ```json
     {
       "tasks": @{body('Select')},
       "taskCount": @{length(body('Select'))},
       "success": true
     }
     ```

#### 5.3.7: Save the Flow

1. Click **Save**

---

### Step 5.4: Create Flow #3 - Update Task Status

#### 5.4.1: Start the Flow

1. Click **+ Create** > **Instant cloud flow**
2. Name it: `Update Task Status`
3. Select **Manually trigger a flow**
4. Click **Create**

#### 5.4.2: Add Input Parameters

1. Click the trigger
2. Add these inputs:
   - **Text**: `taskId`
   - **Text**: `source` (will be "Notion" or "Planner")
   - **Text**: `newStatus` (will be "completed", "inProgress", "notStarted")

#### 5.4.3: Add Condition for Source

1. Click **+ New step**
2. Search for **Condition**
3. Configure: `@triggerBody()['source']` is equal to `Planner`

#### 5.4.4: In the "If yes" Branch (Planner)

1. Click **Add an action** in the Yes branch
2. Search for **Planner** > **Update a task**
3. Configure:
   - **Task Id**: `@triggerBody()['taskId']`
   - **Percent Complete**:
     ```
     @{if(equals(triggerBody()['newStatus'], 'completed'), 100, if(equals(triggerBody()['newStatus'], 'inProgress'), 50, 0))}
     ```

#### 5.4.5: In the "If no" Branch (Notion)

1. Click **Add an action** in the No branch
2. Search for **HTTP**
3. Configure:
   - **Method**: `PATCH`
   - **URI**: `https://api.notion.com/v1/pages/@{triggerBody()['taskId']}`
   - **Headers**:
     | Key | Value |
     |-----|-------|
     | Authorization | Bearer YOUR_NOTION_TOKEN |
     | Notion-Version | 2022-06-28 |
     | Content-Type | application/json |
   - **Body**:
     ```json
     {
       "properties": {
         "Status": {
           "status": {
             "name": "@{if(equals(triggerBody()['newStatus'], 'completed'), 'Done', if(equals(triggerBody()['newStatus'], 'inProgress'), 'In Progress', 'To Do'))}"
           }
         }
       }
     }
     ```

#### 5.4.6: Add Response (After the Condition)

1. Click **+ New step** (outside/below the condition)
2. Add **Response**:
   - **Status Code**: `200`
   - **Body**:
     ```json
     {
       "success": true,
       "taskId": "@{triggerBody()['taskId']}",
       "newStatus": "@{triggerBody()['newStatus']}"
     }
     ```

#### 5.4.7: Save the Flow

1. Click **Save**

---

## 6. Create Conversation Topics

Now return to Copilot Studio to create the conversation topics.

### Step 6.1: Access Topics

1. Go back to **https://copilotstudio.microsoft.com**
2. Open your **Daily Project Checklist Agent**
3. Click **Topics** in the left sidebar

---

### Step 6.2: Create Topic #1 - Welcome

#### 6.2.1: Create the Topic

1. Click **+ Add a topic** > **From blank**
2. Name it: `Welcome`

#### 6.2.2: Add Trigger Phrases

1. Click on **Phrases** in the trigger node
2. Add these phrases (one per line):
   ```
   Hi
   Hello
   Hey
   Good morning
   Start
   Help me with my checklist
   What can you do
   Daily tasks
   ```

#### 6.2.3: Add Welcome Message

1. Click the **+** below the trigger
2. Select **Send a message**
3. Enter:
   ```
   👋 Hello! I'm your Daily Project Checklist Agent.

   I can help you stay organized by pulling tasks from both Notion and Microsoft Planner into a unified daily checklist.

   Here's what I can do:
   • 📋 Build your daily checklist - Aggregate tasks from all your sources
   • 📝 View Notion tasks - See tasks from your Notion databases
   • 📊 View Planner tasks - See tasks from Microsoft Planner
   • ✅ Mark tasks complete - Update task status across platforms
   • 🔄 Check sync status - Verify your connections
   ```

#### 6.2.4: Add Quick Reply Options

1. Click **+** > **Ask a question**
2. Enter the question: `What would you like to do today?`
3. Under **Options**, add:
   - `Build my daily checklist`
   - `View Notion tasks`
   - `View Planner tasks`
   - `Check sync status`
4. Set **Save user response as**: Create a new variable called `UserChoice`

#### 6.2.5: Add Condition Branches

1. Click **+** > **Add a condition** > **Branch based on a condition**
2. For the first condition:
   - **Variable**: `UserChoice`
   - **Operator**: is equal to
   - **Value**: `Build my daily checklist`
3. In this branch, click **+** > **Topic management** > **Go to another topic**
4. Select **Build Daily Checklist** (you'll create this next)

5. Add more condition branches for each option:
   - `View Notion tasks` → Go to `Get Notion Tasks`
   - `View Planner tasks` → Go to `Get Planner Tasks`
   - `Check sync status` → Go to `Sync Status`

#### 6.2.6: Save the Topic

1. Click **Save** in the top right

---

### Step 6.3: Create Topic #2 - Get Notion Tasks

#### 6.3.1: Create the Topic

1. Click **+ Add a topic** > **From blank**
2. Name it: `Get Notion Tasks`

#### 6.3.2: Add Trigger Phrases

```
Show my Notion tasks
Get Notion tasks
View Notion items
What's in Notion
Notion checklist
Tasks from Notion
```

#### 6.3.3: Add Status Message

1. Click **+** > **Send a message**
2. Enter: `🔍 Fetching your tasks from Notion...`

#### 6.3.4: Call the Power Automate Flow

1. Click **+** > **Call an action** > **Create a flow**
   - OR if you already created the flow: **Call an action** > Select **Fetch Notion Tasks**

2. If creating new, it will open Power Automate. Use your existing flow or create one following Section 5.2

3. Back in Copilot Studio, configure the flow inputs:
   - **databaseId**: Enter your Notion database ID (from Step 3.5)
   - **filterStatus**: `active`

4. Save the flow outputs to variables:
   - `tasks` → `NotionTasks`
   - `taskCount` → `NotionCount`

#### 6.3.5: Display Results

1. Click **+** > **Add a condition**
2. Condition: `NotionCount` is greater than `0`

3. In the **Yes** branch:
   - Add **Send a message**: `📝 Your Notion Tasks ({NotionCount} items):`
   - Click **+** > **Variable management** > **Loop (for each)**
   - Loop through: `NotionTasks`
   - Inside the loop, add **Send a message**:
     ```
     • {x.title}
       Status: {x.status} | Due: {x.dueDate}
     ```

4. In the **No** branch:
   - Add **Send a message**: `✨ No pending tasks in Notion!`

#### 6.3.6: Add Follow-up Options

1. After the condition, click **+** > **Ask a question**
2. Question: `What would you like to do?`
3. Options:
   - `View Planner tasks`
   - `Build full checklist`
   - `I'm done`

#### 6.3.7: Save the Topic

---

### Step 6.4: Create Topic #3 - Get Planner Tasks

#### 6.4.1: Create the Topic

1. Click **+ Add a topic** > **From blank**
2. Name it: `Get Planner Tasks`

#### 6.4.2: Add Trigger Phrases

```
Show my Planner tasks
Get Planner tasks
View Planner items
What's in Planner
Microsoft Planner tasks
My plan tasks
```

#### 6.4.3: Add Status Message

1. Click **+** > **Send a message**
2. Enter: `🔍 Fetching your tasks from Microsoft Planner...`

#### 6.4.4: Call the Power Automate Flow

1. Click **+** > **Call an action** > Select **Fetch Planner Tasks**
2. Save outputs to variables:
   - `tasks` → `PlannerTasks`
   - `taskCount` → `PlannerCount`

#### 6.4.5: Display Results

1. Add condition: `PlannerCount` is greater than `0`

2. **Yes** branch:
   - Message: `📊 Your Planner Tasks ({PlannerCount} items):`
   - Loop through `PlannerTasks`
   - Inside loop message:
     ```
     • {x.title}
       Progress: {x.percentComplete}% | Due: {x.dueDate}
     ```

3. **No** branch:
   - Message: `✨ No pending tasks in Planner!`

#### 6.4.6: Save the Topic

---

### Step 6.5: Create Topic #4 - Build Daily Checklist

#### 6.5.1: Create the Topic

1. Click **+ Add a topic** > **From blank**
2. Name it: `Build Daily Checklist`

#### 6.5.2: Add Trigger Phrases

```
Build my daily checklist
Create daily checklist
Show my checklist
What do I need to do today
Today's tasks
My checklist
Combine tasks
```

#### 6.5.3: Add Opening Message

1. Message: `📋 Building your daily project checklist...`

#### 6.5.4: Call Both Flows

1. Click **+** > **Call an action** > **Fetch Notion Tasks**
   - Save outputs: `NotionTasks`, `NotionCount`

2. Click **+** > **Call an action** > **Fetch Planner Tasks**
   - Save outputs: `PlannerTasks`, `PlannerCount`

#### 6.5.5: Display Combined Results

1. Add **Send a message**:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 YOUR DAILY CHECKLIST
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

2. Add condition: `NotionCount` > 0
   - Yes: Message `📝 FROM NOTION ({NotionCount}):`
   - Loop through NotionTasks, display each

3. Add condition: `PlannerCount` > 0
   - Yes: Message `📊 FROM PLANNER ({PlannerCount}):`
   - Loop through PlannerTasks, display each

4. Add **Send a message**:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Total: {NotionCount + PlannerCount} tasks
   ```

#### 6.5.6: Add Action Options

1. **Ask a question**: `What would you like to do?`
2. Options:
   - `Mark a task complete`
   - `Refresh checklist`
   - `I'm all set`

3. Branch on response to handle each option

#### 6.5.7: Save the Topic

---

### Step 6.6: Create Topic #5 - Mark Task Complete

#### 6.6.1: Create the Topic

1. Click **+ Add a topic** > **From blank**
2. Name it: `Mark Task Complete`

#### 6.6.2: Add Trigger Phrases

```
Mark task complete
Complete a task
Check off task
Done with task
Finish task
Mark as done
```

#### 6.6.3: Ask Which Task

1. **Ask a question**: `Which task would you like to mark as complete? Please enter the task name.`
2. Save as: `TaskName` (Open-ended text)

3. **Ask a question**: `Is this task from Notion or Planner?`
4. Options: `Notion`, `Planner`
5. Save as: `TaskSource`

6. **Ask a question**: `Please enter the task ID (you can find this in the task details).`
7. Save as: `TaskId`

#### 6.6.4: Call Update Flow

1. Click **+** > **Call an action** > **Update Task Status**
2. Configure inputs:
   - **taskId**: `{TaskId}`
   - **source**: `{TaskSource}`
   - **newStatus**: `completed`

#### 6.6.5: Confirm Success

1. **Send a message**: `✅ Task marked as complete! Great job!`

2. **Ask a question**: `Would you like to mark another task complete?`
3. Options: `Yes`, `No`
4. Branch: If Yes, loop back; If No, end or go to Welcome

#### 6.6.6: Save the Topic

---

### Step 6.7: Create Topic #6 - Sync Status

#### 6.7.1: Create the Topic

1. Click **+ Add a topic** > **From blank**
2. Name it: `Sync Status`

#### 6.7.2: Add Trigger Phrases

```
Sync status
Check connection
Connection status
Are services connected
Check integrations
```

#### 6.7.3: Check Connections

1. **Send a message**: `🔄 Checking connection status...`

2. Call **Fetch Notion Tasks** flow (with a test database ID)
   - This tests the Notion connection

3. Call **Fetch Planner Tasks** flow
   - This tests the Planner connection

4. **Send a message**:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━
   🔗 CONNECTION STATUS
   ━━━━━━━━━━━━━━━━━━━━━━━

   Notion: ✅ Connected
   Planner: ✅ Connected

   All systems operational!
   ━━━━━━━━━━━━━━━━━━━━━━━
   ```

#### 6.7.4: Save the Topic

---

### Step 6.8: Create Topic #7 - Fallback

#### 6.8.1: Find System Fallback

1. In Topics, look for **System** topics
2. Find **Fallback** or **Unknown intent**
3. Click to edit it

#### 6.8.2: Customize Fallback

1. Replace the default message with:
   ```
   I'm not sure I understood that. Let me help you with what I can do.

   I can help you with:
   • 📋 Building your daily checklist
   • 📝 Viewing Notion tasks
   • 📊 Viewing Planner tasks
   • ✅ Marking tasks complete
   • 🔄 Checking connection status

   What would you like to do?
   ```

2. Add quick reply options to guide users

#### 6.8.3: Save the Topic

---

## 7. Connect Flows to Topics

### Step 7.1: Verify All Flow Connections

1. Go to **Settings** > **Generative AI** > **Actions**
2. Ensure all 3 flows are listed:
   - Fetch Notion Tasks
   - Fetch Planner Tasks
   - Update Task Status

### Step 7.2: Test Each Flow Connection

1. Go to each topic that uses a flow
2. Click on the **Call an action** node
3. Verify the flow is properly connected
4. Check input/output mappings

---

## 8. Test Your Agent

### Step 8.1: Open Test Panel

1. Click **Test your agent** in the bottom left (or top right)
2. A chat panel will open

### Step 8.2: Test Each Scenario

Test these conversations:

**Test 1: Welcome**
```
You: Hi
Agent: [Should show welcome message with options]
```

**Test 2: Build Checklist**
```
You: Build my daily checklist
Agent: [Should fetch from both sources and display combined list]
```

**Test 3: View Notion Tasks**
```
You: Show my Notion tasks
Agent: [Should display Notion tasks]
```

**Test 4: View Planner Tasks**
```
You: What's in Planner?
Agent: [Should display Planner tasks]
```

**Test 5: Mark Complete**
```
You: Mark a task complete
Agent: [Should ask for task details and update]
```

**Test 6: Check Status**
```
You: Check connection status
Agent: [Should show both connections as working]
```

### Step 8.3: Debug Issues

If something doesn't work:

1. Check the **Test panel** for error messages
2. Go to **Power Automate** > **Flow runs** to see flow execution logs
3. Verify your Notion token and database ID are correct
4. Check that Planner permissions are authorized

---

## 9. Publish Your Agent

### Step 9.1: Final Review

1. Go through all topics one more time
2. Ensure all trigger phrases make sense
3. Verify all flows are working

### Step 9.2: Publish

1. Click **Publish** in the top right
2. Review the publish summary
3. Click **Publish** again to confirm

### Step 9.3: Configure Channels (Optional)

After publishing, you can deploy your agent to:

1. Click **Channels** in the left sidebar
2. Choose where to deploy:
   - **Microsoft Teams** - Add to Teams
   - **Website** - Embed on your site
   - **Mobile app** - Use in mobile apps
   - **Other channels** - Slack, Facebook, etc.

### Step 9.4: Share with Users

For **Microsoft Teams**:
1. Click **Microsoft Teams** channel
2. Click **Open in Teams**
3. Share the agent with your team

---

## Troubleshooting Guide

### Issue: Notion flow fails

**Solution:**
1. Verify your Integration Token is correct
2. Check the database ID (32 characters, no dashes)
3. Ensure integration has access to the database
4. Check property names match (Name, Status, Due Date, Priority)

### Issue: Planner flow fails

**Solution:**
1. Re-authorize the Planner connection in Power Automate
2. Verify you have access to Planner plans
3. Check your Microsoft 365 license includes Planner

### Issue: Agent doesn't understand input

**Solution:**
1. Add more trigger phrases to topics
2. Enable Generative answers in settings
3. Check the Fallback topic is configured

### Issue: Variables not passing correctly

**Solution:**
1. Verify variable names match exactly
2. Check data types (text, number, table)
3. Use the debugger in the test panel

---

## Quick Reference Card

| Action | What to Say |
|--------|------------|
| See all tasks | "Build my daily checklist" |
| See Notion only | "Show Notion tasks" |
| See Planner only | "View Planner tasks" |
| Complete a task | "Mark task complete" |
| Check connections | "Sync status" |
| Get help | "What can you do?" |

---

## Appendix: Environment Variables

Store these values securely:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| Notion Token | `secret_xxx...` | Notion Integrations page |
| Notion Database ID | 32-char string | Database URL |
| Planner Plan ID | GUID (optional) | Plan URL |

---

**Congratulations!** Your Daily Project Checklist Agent is now ready to use!

For support or questions, refer to:
- [Copilot Studio Documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/)
- [Power Automate Documentation](https://learn.microsoft.com/en-us/power-automate/)
- [Notion API Documentation](https://developers.notion.com/)
- [Microsoft Graph Planner API](https://learn.microsoft.com/en-us/graph/api/resources/planner-overview)
