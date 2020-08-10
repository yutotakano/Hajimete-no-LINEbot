# Hajimete no LINEbot

This repository contains code for a minimal interactive bot for LINE, a popular chatting app in Japan.

Quite often, "starter" and "minimal" bot tutorials only cover adding pre-set replies (e.g. for customer support) that do not handle each user separately.
This is because tieing responses to users and making the bot act accordingly requires the use of a database to keep track of each user, and this is not an easy nor fun task.

The script for this bot, intended to run on Google Apps Script, handles database operations on an instance of Google Spreadsheet. This means it requires nothing more than basic knowledge of Google Drive to operate.

## Info

This bot takes note of a number from each user that messages it, and stores them in the database (spreadsheet), which can be directly accessed as necessary.
It disregards any messages sent in groups or rooms, so users have to message the bot directly.
With some knowledge of JavaScript, one can easily modify the script to do just about anything that requires a database.
Some potential uses of this codebase may be to:

- keep track of self-reported body temperatures of every employee
- keep track of self-reported records of athletic sports
- keep track of votes, since only the spreadsheet owner can see the values
- keep track of 

The database being operated on Google Spreadsheet has additional benefits compared to a usual SQL or JSON database.
The platform is naturally designed for number operations, and thus with the use of another sheet (for non-destructive operations) one can create graphs, pivot tables, and complex data visualisations through expressions.

## Basic Usage

1. Create an empty Google Spreadsheet and keep note of its URL from the address bar.
2. Create a new Google Apps Script and copy the contents of Hajimete-no-LINEbot.js into it.
3. Edit the necessary variables, including the default reply, spreadsheet URL, and LINE API token.

## License

This repository is licensed under GNU General Public License v3.0. Yuto Takano. 2020.

