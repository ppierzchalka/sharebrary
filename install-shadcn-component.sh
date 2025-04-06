#!/bin/bash

# Check if component name is provided
if [ -z "$1" ]; then
  echo "Please provide a component name"
  echo "Usage: ./install-shadcn-component.sh button"
  exit 1
fi

COMPONENT_NAME=$1

# Install the component using shadcn CLI
pnpm dlx shadcn@latest add $COMPONENT_NAME

# Create the proper directory if it doesn't exist
mkdir -p src/libs/ui/src/lib/$COMPONENT_NAME

# Check if the component was created in the ui subdirectory
if [ -f "src/libs/ui/src/lib/ui/$COMPONENT_NAME.tsx" ]; then
  # Fix import paths
  sed -i 's|import { cn } from "src/lib/utils"|import { cn } from "../utils"|g' src/libs/ui/src/lib/ui/$COMPONENT_NAME.tsx
  
  # Move the component to the correct location
  mv src/libs/ui/src/lib/ui/$COMPONENT_NAME.tsx src/libs/ui/src/lib/$COMPONENT_NAME/$COMPONENT_NAME.tsx
  
  # Create barrel export file
  echo "export * from './$COMPONENT_NAME';" > src/libs/ui/src/lib/$COMPONENT_NAME/index.ts
  
  # Remove the ui directory if it's empty
  if [ -z "$(ls -A src/libs/ui/src/lib/ui)" ]; then
    rm -rf src/libs/ui/src/lib/ui
  fi
  
  echo "Component $COMPONENT_NAME has been installed and moved to the correct location."
  echo "Created barrel export file at src/libs/ui/src/lib/$COMPONENT_NAME/index.ts"
else
  echo "Component was not found in the expected location."
  exit 1
fi