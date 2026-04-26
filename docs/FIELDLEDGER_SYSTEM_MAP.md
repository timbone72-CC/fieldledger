# FieldLedger System Map

## 1. Purpose

This file defines what tools, sites, folders, and services are used by FieldLedger.

Nothing should be added to the project without being listed here first.

## 2. Local Development

### PC

The app is currently developed on the user's PC.

Workspace path:

```text
/home/timbo/projects/fieldledger
Editor

Primary editor:

VS Code

VS Code is used to edit files, view folders, and run the integrated terminal.

Terminal

Primary terminal:

Ubuntu/WSL

PowerShell may open inside VS Code, but app commands should prefer Ubuntu/WSL when working inside the Linux project path.

3. Version Control
Git

Git is used for local project history.

Current branch:

main

Every stable change should be committed before moving to the next major feature.

GitHub

GitHub will be used later for:

backup
transfer to laptop
future collaboration
release history

GitHub is not required for the app to run locally.

4. App Runtime
Vite

Vite runs the local React development server.

Default local address:

http://localhost:5173
React

React is used for the user interface.

5. Data Storage

MVP storage must be local-first.

Allowed MVP storage:

browser localStorage
browser IndexedDB
downloaded export files

Not allowed for MVP:

paid cloud database
paid backend service
paid OCR storage
paid AI service
required user login
6. Photo Capture

Ticket and receipt photos should be captured inside the app later.

MVP photo handling should use browser-supported camera/file input features.

No paid photo service is allowed in the MVP.

7. OCR / AI

The MVP is AI-free.

Handwriting extraction may be explored later, but the first app must work with manual entry and manual review.

Future OCR must be optional.

8. Exports

The app should eventually export:

PDF
spreadsheet

Exports must work from pay-period data.

Exports must not require a paid service for the MVP.

9. Tax Estimate

Tax estimate is for planning only.

It must be calculated locally from user settings and pay-period net income.

10. Current System Boundary

FieldLedger currently includes:

local repo
VS Code editor
Ubuntu/WSL terminal
Git history
Vite React app
local browser preview
docs contracts

FieldLedger does not currently include:

GitHub remote
cloud hosting
backend server
AI
OCR
user accounts
paid services