#!/usr/bin/env bash
# This script uses the aws cli tool to upload only changed files to the s3 bucket, and then
# invalidate the corresponding cloudfront caches.
#
# Usage: `yarn deploy`
#
# Login to aws cli with `aws login`


# Script intended to run from unix environment

# Turn on command output
set -x #echo on

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
BUCKET_ADDRESS="s3://www.bbplanner.xyz"
## Expects a single argument: the s3 bucket to upload to.
#
#if [ "$#" -ge 1 ]; then
#    BUCKET_ADDRESS="$1"
#else
#    echo "Missing bucket address"
#    exit 1
#fi

productionAssetFolder="${ROOT_DIR}/dist"
if ! [ -d "${productionAssetFolder}" ]; then
    echo "Cannot find production asset folder located at: ${productionAssetFolder}"
    exit 1
fi

echo "Uploading static assets to ${BUCKET_ADDRESS}"

# Upload file types that should have "charset=UTF-8" appended to their content-type
# NOTE: If you add file types below, be sure to add them to the exclude list in the command following
# this list (the command that uploads all other file types)
aws s3 \
    --size-only \
    --no-progress \
    sync "${productionAssetFolder}" "${BUCKET_ADDRESS}" \
    --exclude "*" \
    --include "*.js" \
    --cache-control "public, max-age=31536000, immutable" \
    --content-type "text/javascript; charset=UTF-8"

aws s3 \
    --size-only \
    --no-progress \
    sync "${productionAssetFolder}" "${BUCKET_ADDRESS}" \
    --exclude "*" \
    --include "*.css" \
    --cache-control "public, max-age=31536000, immutable" \
    --content-type "text/css; charset=UTF-8"

aws s3 \
    --size-only \
    --no-progress \
    sync "${productionAssetFolder}" "${BUCKET_ADDRESS}" \
    --exclude "*" \
    --include "*.json" \
    --cache-control "public, max-age=31536000, immutable" \
    --content-type "application/json; charset=UTF-8"

# Make cloudfront cache html files (since we invalidate their cache manually), but ensure
# no caching on end user browsers
aws s3 \
    --no-progress \
    sync "${productionAssetFolder}" "${BUCKET_ADDRESS}" \
    --exclude "*" \
    --include "*.html" \
    --cache-control "public, max-age=0, s-maxage=604800" \
    --content-type "text/html; charset=UTF-8"
# it appears that it can be common for the index.html to not change in size even though script tag references change
#    --size-only \

aws s3 \
    --size-only \
    --no-progress \
    sync "${productionAssetFolder}" "${BUCKET_ADDRESS}" \
    --exclude "*" \
    --include "favicon.png" \
    --content-type "image/png"

# Upload all other file types (png/svg/jpg/etc) with default content-types from aws
# NOTE: If you add file types to the above list, be sure to add them to the exclude list in this command
aws s3 \
    --size-only \
    --no-progress \
    sync "${productionAssetFolder}" "${BUCKET_ADDRESS}" \
    --exclude "*.js" \
    --exclude "favicon.png" \
    --exclude "*.css" \
    --exclude "*.json" \
    --exclude "*.html" \
    --cache-control "public, max-age=31536000, immutable"

# Now invalidate the non-immutable entities

# Turn off command output
set +x # turns echo off

DATESTRING=$(date +"%Y-%m-%d_%H-%M-%S")
OUTPUT_DIR="${ROOT_DIR}/output"
INVALIDATION_FILE="${OUTPUT_DIR}/invalidate_cloudfront.json"
mkdir -p "${OUTPUT_DIR}"

JSON_STRING='
{
  "Paths": {
    "Quantity": 3,
    "Items": ["/index.html", "/error.html", "/"]
  },
  "CallerReference": "'$DATESTRING'"
}
'
printf "%s\n" "$JSON_STRING" > "${INVALIDATION_FILE}"

# Turn on command output
set -x #turns echo on

aws cloudfront create-invalidation \
    --distribution-id E2009WZB53ANZE \
    --invalidation-batch "file://${INVALIDATION_FILE}"

#aws cloudfront create-invalidation \
#    --distribution-id E1S2RN5GC9LKLO \
#    --invalidation-batch "file://${INVALIDATION_FILE}"
