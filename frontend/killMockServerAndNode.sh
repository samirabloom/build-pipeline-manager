#!/usr/bin/env bash

ps -ef | grep 'mockserver\|node' | grep -v grep | grep -v $0 | awk '{print $2}' | xargs kill