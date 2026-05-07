# FieldLedger PWA Release Plan

## 1. Purpose

Make FieldLedger feel like a real downloadable app while keeping the MVP offline-first, AI-free, net-zero-cost, and manual-review-first.

## 2. Release Goal

FieldLedger should be installable from a phone or computer browser as a Progressive Web App.

The user should be able to:

- Open FieldLedger from an app icon
- Use it in standalone app mode
- Keep local records on the device
- Download JSON backups
- Download CSV exports
- Continue using the app without a required backend or login

## 3. Not In Scope Yet

This phase does not include:

- App Store release
- Play Store release
- User accounts
- Cloud sync
- Paid hosting
- Paid APIs
- Google Sheets API integration
- Formula customization by users

## 4. Required PWA Pieces

The app needs:

- Web app manifest
- App name
- Short app name
- App icons
- Theme color
- Standalone display mode
- Manifest link in index.html
- Service worker
- Offline app shell caching
- Phone install test
- Desktop install test

## 5. Data Safety Rules

PWA install must not hide the fact that data is local to the browser/device.

The app must keep warning users that:

- Phone data and computer data are separate
- JSON backup/import is how data moves between devices
- Clearing browser data can delete local records
- Tax estimates are planning only, not tax advice

## 6. Definition of Done

This phase is done only when:

- App installs on phone
- App launches from phone icon
- App installs or opens cleanly on desktop
- App works after refresh
- App works after closing and reopening
- Existing core tests pass
- JSON backup still downloads
- CSV export still downloads
- No existing FieldLedger calculations change
- GitHub Pages live app still works
- Checkpoint is updated from git log
