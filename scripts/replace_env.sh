#!/bin/bash

while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ $line == *=* ]] && [[ ! $line == \#* ]]; then
        key="${line%=*}"
        secret_key="${key^^}" # Convert to uppercase

        # Check if the variable is set in the GitHub Actions environment
        if secret_value=$(printenv "$secret_key"); then
            echo "Processing: $secret_key" # Debugging line
            sed -i "s|$key=.*|$key=\"$secret_value\"|" .env
        else
            echo "Skipping: $secret_key (not set in GitHub Actions environment)"
        fi
    fi
done < .env
