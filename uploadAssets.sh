#!/usr/bin/env bash
# This script uses the aws cli tool to upload only changed files to the s3 bucket, and then
# invalidate the corresponding cloudfront caches.
#
# Usage: `yarn deploy`
#
# Note: credentials are accessed from the aws cli config settings. See:
#     https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html

# Turn on command output
set -x #echo on

BUCKET_ADDRESS="s3://www.bbplanner.xyz"
## Expects a single argument: the s3 bucket to upload to.
#
#if [ "$#" -ge 1 ]; then
#    BUCKET_ADDRESS="$1"
#else
#    echo "Missing bucket address"
#    exit 1
#fi

productionAssetFolder="./dist"
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

aws s3 \
    --size-only \
    --no-progress \
    sync "${productionAssetFolder}" "${BUCKET_ADDRESS}" \
    --exclude "*" \
    --include "*.html" \
    --content-type "text/html; charset=UTF-8"

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
    --cache-control "public, max-age=31536000, immutable" \

# Now invalidate the non-immutable entities
# aws cli complains about invalid paths, but it does seem to work perfectly fine!
aws cloudfront create-invalidation \
    --distribution-id E1S2RN5GC9LKLO \
    --paths "/index.html" "/error.html"

#aws cloudfront create-invalidation \
#    --distribution-id E2009WZB53ANZE \
#    --paths "/index.html" "/error.html"