#!/bin/sh

hashed_password=$(caddy hash-password --plaintext $PASSWORD)
export HASHED_PASSWORD=$hashed_password
