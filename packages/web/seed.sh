#!/usr/bin/env sh
rm -rf /tmp/sonarish-repos
mkdir -p /tmp/sonarish-repos
git clone --depth 1 https://wwwadmgit.rap.raftel/sft/shift.git /tmp/sonarish-repos/shift
git clone --depth 1 https://wwwadmgit.rap.raftel/isomorphic/redux-proto.git /tmp/sonarish-repos/redux-proto
git clone --depth 1 https://github.com/expressjs/express.git /tmp/sonarish-repos/express
