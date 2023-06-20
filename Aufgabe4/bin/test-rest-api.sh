#!/usr/bin/env bash

SERVER="${SERVER:-localhost}"
PORT="${PORT:-3000}"
API_URL="${API_URL:-/api/geotags}"
CURL_CMD="${CURL_CMD:-curl}"

GT_LATITUDE="";
GT_LONGITUDE="";
GT_NAME="";
GT_HASHTAG="";
GT_ID="";
SEARCHTERM="";

#GET, POST, PUT, DELETE
function get() {
  ${CURL_CMD} -X GET -H 'Content-Type: application/json' "${SERVER}:${PORT}${API_URL}?searchterm=${SEARCHTERM}&latitude=${GT_LATITUDE}&longitude=${GT_LONGITUDE}";
}

function post() {
  ${CURL_CMD} -X POST -H 'Content-Type: application/json' -d "{\"name\": \"${GT_NAME}\", \"latitude\": \"${GT_LATITUDE}\", \"longitude\": \"${GT_LONGITUDE}\", \"hashtag\": \"${GT_HASHTAG}\"}" "${SERVER}:${PORT}${API_URL}"
}

function put() {
  ${CURL_CMD} -X PUT -H 'Content-Type: application/json' -d "{\"name\": \"${GT_NAME}\", \"latitude\": \"${GT_LATITUDE}\", \"longitude\": \"${GT_LONGITUDE}\", \"hashtag\": \"${GT_HASHTAG}\"}" "${SERVER}:${PORT}${API_URL}/${GT_ID}"
}

function delete() {
  ${CURL_CMD} -X DELETE -H 'Content-Type: application/json' "${SERVER}:${PORT}${API_URL}/${GT_ID}"
}

# Menü anzeigen
function show_menu() {
  echo "REST-API-Client Menü:"
  echo "1. GET"
  echo "2. POST"
  echo "3. PUT"
  echo "4. DELETE"
  echo "5. Beenden"
}

# Benutzereingabe verarbeiten
function process_user_input() {
  read -p "Bitte wählen Sie eine Methode aus (1-5): " choice
  echo "Bitte Daten eingeben ... "
  case $choice in
    1)
      read -p "searchterm: " && SEARCHTERM="${REPLY}";
      read -p "latitude: " && GT_LATITUDE="${REPLY}";
      read -p "longitude: " && GT_LONGITUDE="${REPLY}";
      echo "";
      echo "####### Result: ######"
      get
      echo "";
      echo "##### Result ENDE ####"
      ;;
    2)
      read -p "name: " && GT_NAME="${REPLY}";
      read -p "latitude: " && GT_LATITUDE="${REPLY}";
      read -p "longitude: " && GT_LONGITUDE="${REPLY}";
      read -p "Hashtag: " && GT_HASHTAG="${REPLY}";
      echo "";
      echo "####### Result: ######"
      post
      echo "";
      echo "##### Result ENDE ####"
      ;;
    3)
      read -p "id: " && GT_ID="${REPLY}";
      read -p "name: " && GT_NAME="${REPLY}";
      read -p "latitude: " && GT_LATITUDE="${REPLY}";
      read -p "longitude: " && GT_LONGITUDE="${REPLY}";
      read -p "Hashtag: " && GT_HASHTAG="${REPLY}";
      echo "";
      echo "####### Result: ######"
      put
      echo "";
      echo "##### Result ENDE ####"
      ;;
    4)
      read -p "id: " && GT_ID="${REPLY}";
      echo "";
      echo "####### Result: ######"
      delete
      echo "";
      echo "##### Result ENDE ####"
      ;;
    5)
      echo "Das Skript wird beendet."
      exit 0
      ;;
    *)
      echo "Ungültige Auswahl. Bitte geben Sie eine Zahl zwischen 1 und 5 ein."
      ;;
	esac
}

# Hauptfunktion
function main() {
  while true; do
    show_menu
    process_user_input
    echo "";
  done
}

main


