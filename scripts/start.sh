#!/bin/bash

start_ses_local () {
  npm run ses:local > /dev/null 2>&1 &
  echo "SES Local started"
  SES_LOCAL_PID=$!
}

stop_ses_local () {
  if [ "$1" == "--exec" ]
  then
    COUNT=`ps ax | grep -v grep | grep $SES_LOCAL_PID -c`
    if [ "$COUNT" != "0" ]
    then
      echo "Halting SES Local"
      kill $SES_LOCAL_PID
    fi
  fi
}

start_ses_local "$@"
serverless offline start "$@"
stop_ses_local "$@"