#!/bin/bash

while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ $line == *=* ]] && [[ ! $line == \#* ]]; then
        key="${line%=*}"
        secret_key="${key^^}" # Convert to uppercase
        secret_value="${!secret_key}"
        sed -i "s/$key=.*/$key=$secret_value/" .env
    fi
done < .env
