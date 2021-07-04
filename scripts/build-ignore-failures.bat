@echo off
:Start
npm run build
:: Wait 5 seconds before restarting.
TIMEOUT /T 5
GOTO:Start