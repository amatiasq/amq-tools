#!/usr/bin/env bash

root=$(pwd)
name=$(./scripts/read-json.js package.json name)
version=$(./scripts/read-json.js package.json version)

./scripts/generate-packages.js
cp README.md dist/cjs/
cp README.md dist/es6/

echo ''
echo 'Publishing CommonJS...'
cd $root/dist/cjs
npm publish

echo ''
echo 'Publishing ECMAScript 6 version...'
cd $root/dist/es6
npm publish

cd $root

echo ''
echo 'Deploying to server...'

host='amatiasq@amatiasq.com'
parent="www/repos/$name"
target="$parent/$version"
lastest="$parent/lastest"
command="rm $lastest; rm -r $target; mkdir -p $parent"

ssh "$host" "$command" 2>/dev/null
scp -r dist/web "$host:$target"
ssh "$host" ln -s "$version" "$lastest"

echo ''
echo "Deployed version $version."
