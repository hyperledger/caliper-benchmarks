#!/bin/bash

GO_FILES=$(find . -type f -name "*.go")

if [ -n "$GO_FILES" ]; then
  gofmt -s -w $GO_FILES
else
  echo "No Go files found for formatting check."
fi

echo "Formatting check complete!"
