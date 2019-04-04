const {
  SearchService
} = require('azure-search-client');

const client = new SearchService('alpine-ski-house', '4B30F37835DFF403D277640BD0304073', '2017-11-11');

async function getSearchResults(query) {
  const resp = await client.indexes.use('azureblob-index').search({
    search: query
  });
  return resp.result.value;
};

module.exports.getSearchResults = getSearchResults;
