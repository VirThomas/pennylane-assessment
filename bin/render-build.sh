#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
# clean
rm -rf public
# build
npm install --prefix pennylane-front
npm run build --prefix pennylane-front

# migrate
bundle exec rake db:migrate
# postbuild
cp -a pennylane-front/build/. public/