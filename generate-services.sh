#!/bin/bash

clear

echo
echo "Generating Angular Services."
echo

lb-ng ./server/server.js ./client/js/lb-services.js

echo
echo "Done."
echo