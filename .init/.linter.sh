#!/bin/bash
cd /home/kavia/workspace/code-generation/kavia-usage-insights-dashboard-210323-210317/session_dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

