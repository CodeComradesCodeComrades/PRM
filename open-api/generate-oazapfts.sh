npx --yes oazapfts --optimistic --argumentStyle=object --useEnumType openapi-specs.json typescript-sdk/src/fetch-client.ts
npm --prefix typescript-sdk run build

node sync-version