#!/bin/bash

JS_FILES=$(find . -type f \( -name "*.js" -or -name "package.json" \))

echo "Linting JavaScript files..."
npx eslint -c .eslintrc.js ${JS_FILES}

if [ $? -ne 0 ]; then
  echo "ESLint found errors. Please fix them before continuing."
  exit 1
fi


