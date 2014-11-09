#!/usr/bin/env bash

# Use this one-liner to produce a JSON literal from the Git log:

cd ./app/data/mhroot


#git log -n1 --format="Last committed item in this release was by %an, `git log -n1 --format=%ad# | awk '{print strftime("%y%m%d%H%M",$1)}'`, message: %s (%h) [%d]"

#git log --no-merges --numstat --date=iso --format='{"commit":"%H","author":"%an","message","%f",%n"date":" %ad ",'>> ./log2.txt
#git log -n 1 --pretty=oneline --name-status >> ./log.txt
#git diff --name-status HEAD^ HEAD >> ./log1.txt
#git log --all --pretty=format: --name-only --diff-filter=D | sort -u >> ./log0.txt
git log --date=iso --diff-filter=AD --summary --format="Date: ""%ad">> ./ADlog.txt

#below works
#git log --date=iso --format="Date: ""%ad" --diff-filter=AD --summary | egrep 'Date|create|delete'>> ./ADlog.txt