# FieldLedger Trusted User Local Documents

## Purpose

Trusted-user setup and reference documents are maintained locally on Tim's laptop.

These files are intentionally outside the FieldLedger repo:

```text
/home/timbone/Documents/FieldLedger-Trusted-Sheets
```

## Known Local Files

The current local document set includes:

```text
Trusted-User-Instructions.html
Trusted-User-Instructions.txt
Trusted-User-Operator-Checklist.txt
User-1-Setup-Message.txt
User-1-Trusted-Sheet.txt
User-2-Trusted-Sheet.txt
```

## Privacy Boundary

These local files may contain tester-specific data and must not be committed.

Possible private or sensitive contents include:

- tester names
- tester emails
- copied Sheet links
- Apps Script Web App URLs
- import tokens
- setup status notes

Do not copy real tokens, Web App URLs, tester emails, tester names, copied Sheet links, private tester details, local file contents, or screenshots into the repo.

## Operating Rule

Before creating any new trusted-user checklist, setup message, tester reference document, or instruction file, first check the local folder:

```bash
ls -1 ~/Documents/FieldLedger-Trusted-Sheets | sort
```

If the file already exists, update the existing local file instead of recreating duplicate documentation.

## Current Status

The trusted-user local document set has already been created.

User 2 setup is intentionally waiting until more user information is available.
