#!/usr/bin/env bash

SERVER="${SERVER:-localhost}"
PORT="${PORT:-3000}"
API_URL="${API_URL:-/api/geotags}"
CURL_CMD="${CURL_CMD:-curl}"

${CURL_CMD} -X GET -H 'Content-Type: application/json' "${SERVER}:${PORT}${API_URL}?searchterm=""&latitude=""&longitude=""";

