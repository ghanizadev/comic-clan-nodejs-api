#!/usr/bin/env bash
# Use this script to test if a given TCP host/port are available

while ! nc -z redis://redis 6379; do sleep 1  done
