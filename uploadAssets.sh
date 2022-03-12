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
    --cache-control "public, max-age=31536000, immutable" \

# Now invalidate the non-immutable entities

# Holy batman this is janky.
# We must generate a json file to sidestep some "peculiarities" of git bash
# And then, naturally, when we read in the file to the aws cli it resolves with
# standard windows uris rather than unix ones (although somehow a mix of them does
# seem to work. But oh my goodness the jank)
DATESTRING=$(date +"%Y-%m-%d_%H-%M-%S")
JSON_STRING='
{
  "Paths": {
    "Quantity": 3,
    "Items": ["/index.html", "/error.html", "/"]
  },
  "CallerReference": "'$DATESTRING'"
}
'
echo $JSON_STRING > $PWD/output/invalidate_cloudfront.json
LOCALPATH=$(cmd //c cd)
aws cloudfront create-invalidation \
    --distribution-id E2009WZB53ANZE \
    --invalidation-batch file://$LOCALPATH/output/invalidate_cloudfront.json

#aws cloudfront create-invalidation \
#    --distribution-id E1S2RN5GC9LKLO \
#    --invalidation-batch file://$LOCALPATH/output/invalidate_cloudfront.json