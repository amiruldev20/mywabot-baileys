#!/bin/bash

# Mengecek apakah argumen pesan telah diberikan
if [ -z "$1" ]; then
    echo "Harap berikan pesan untuk commit."
    exit 1
fi

# Menjalankan perintah git dengan pesan yang diberikan
git add .
git commit -m "$*"
git push
