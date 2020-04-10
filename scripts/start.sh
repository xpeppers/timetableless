#!/bin/bash

start_ses_local () {
  npm run ses:local > /dev/null 2>&1 &
  echo "SES Local started"
  SES_LOCAL_PID=$!
}

stop_ses_local () {
  if [ "$1" == "--exec" ]
  then
    # in this case we don't have a ctrl+C exit command, so we have to close ses_local manually
    echo "Halting SES Local"
    kill $SES_LOCAL_PID
  fi
}

start_ses_local "$@"
serverless offline start "$@"
stop_ses_local "$@"