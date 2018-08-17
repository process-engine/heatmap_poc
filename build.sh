#!/bin/bash

# Execute npm run build in a folder specified
# by the first parameter; returns to the starting
# location unsing cd's jumpstack.
function buildPackage() {
  cd "${1}"
  npm run build
  cd -
}

# build contracts first
# TODO: Add contracts here

# build implementations
# TODO: Add implementations here
