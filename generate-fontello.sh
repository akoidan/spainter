#!/bin/bash

# defining the project structure
PROJECT_ROOT=`pwd`
FONT_DIR="$PROJECT_ROOT/font"
RED='\033[0;31m'
GREEN='\033[0;32m'

RANDOM_DIR=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
TMP_DIR="${TMP_DIR:-/tmp/$RANDOM_DIR}"

chp(){
 size=${#1}
 indent=$((25 - $size))
 printf "\e[1;37;40m$1\e[0;36;40m"
 printf " "
 for (( c=1; c<= $indent; c++))  ; do
 printf "."
 done
 printf " \e[0;33;40m$2\n\e[0;37;40m"
}


printSuccess() {
    printf "\e[92m$1\e[0;37;40m\n"
}

printOut() {
    printf "\e[93m$1\e[0;37;40m\n"
}

printError() {
    >&2  printf "\e[91m$1\e[0;37;40m\n"
}

safeRunCommand() {
 eval "$@"
 ret_code=$?
 if [ $ret_code != 0 ]; then
   printf "\e[91mExecution of command below has failed \e[93m\n"
   >&2 echo "$@"
   printf "\e[91mResult code is $ret_code \e[0;37;40m\n"
   exit $ret_code
 fi
}

post_fontello_conf() {
    printOut "Creating fontello config"
    safeRunCommand curl --silent --show-error --fail --form "config=@./config.json" --output .fontello http://fontello.com
    fontello_session=$(cat .fontello)
    url="http://fontello.com/`cat .fontello`"
    echo "Genereted fontello url: $url"
}

show_fontello_session() {
    fontello_session=$(cat .fontello)
    url="http://fontello.com/`cat .fontello`"
    printOut "Fonts url is: $url"
}

download_fontello() {
    fontello_session=$(cat .fontello)
    printOut "Downloading fontello using fontello session '$fontello_session'"
    mkdir -p "$TMP_DIR/fontello"
    safeRunCommand curl -X GET "http://fontello.com/$fontello_session/get" -o "$TMP_DIR/fonts.zip"
    safeRunCommand unzip "$TMP_DIR/fonts.zip" -d "$TMP_DIR/fontello"
    dir=$(ls "$TMP_DIR/fontello")
    safeRunCommand cp -v "$TMP_DIR/fontello"/$dir/font/* "$FONT_DIR"
    safeRunCommand cp -v "$TMP_DIR/fontello/$dir/css/fontello-codes.css" "$PROJECT_ROOT/fontello-codes.scss"
    safeRunCommand cp -v "$TMP_DIR/fontello"/$dir/demo.html "$PROJECT_ROOT"
    safeRunCommand cp -v "$TMP_DIR/fontello"/$dir/config.json "$PROJECT_ROOT"

    if type "sed" &> /dev/null; then
        sed -i '1i\@charset "UTF-8";' "$PROJECT_ROOT/fontello-codes.scss"
    else
        printError "WARNING: sass would be compiled w/o encoding"
    fi
}


if [ "$1" = "post" ]; then
    post_fontello_conf
elif [ "$1" = "show" ]; then
    show_fontello_session
elif [ "$1" = "save" ]; then
    post_fontello_conf
    download_fontello
    git --no-pager diff "$PROJECT_ROOT/config.json"
    printSuccess "Fonts have been installed"
    printOut "You can view icons at $PWD/demo.html"
elif [ "$1" = "generate" ]; then
    post_fontello_conf
    download_fontello
    git --no-pager diff "$PROJECT_ROOT/config.json"
    printSuccess "Fonts have been installed"
    printOut "You can view icons at $PWD/demo.html"
else
 printf " \e[93mWellcome to fontello download manager, available commands are:\n"
 chp post "Creates fontello session from config.json and saves it to \e[96m .fontello \e[0;33;40mfile"
 chp show "Shows current used url for editing fonts"
 chp save "Download cached fontello from session in \e[96m .fontello \e[0;33;40m"
 chp generate "Downloads fontello files from \e[96m .config \e[0;33;40mfile (same as \e[1;37;40mpost\e[0;33;40m + \e[1;37;40msave\e[0;33;40m)"
fi