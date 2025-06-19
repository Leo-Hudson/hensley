import { createWixClient, logError } from ".";
import Fuse from 'fuse.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryAsyncOperation(operation, retries = 3, initialDelayMs = 1000) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const currentDelay = initialDelayMs * Math.pow(2, attempt);
      logError(`Operation failed (attempt ${attempt + 1}/${retries}): ${error.message}`);

      if (attempt < retries - 1) {
        logError(`Retrying in ${currentDelay}ms...`);
        await delay(currentDelay);
      }
    }
  }

  logError(`All retry attempts failed`);
  throw lastError;
}

const correctSearchTerm = async (searchTerm, keywords) => {
  const fuse = new Fuse(keywords, { threshold: 0.4 });
  const result = fuse.search(searchTerm);
  return result.length ? result[0].item : searchTerm;
};

const queryCollection = async (payload) => {
  if (!payload?.dataCollectionId) {
    return { error: "Missing dataCollectionId", status: 400 };
  }

  try {
    const {
      dataCollectionId,
      includeReferencedItems = [],
      returnTotalCount = false,
      contains,
      limit,
      eq = [],
      ne = [],
      hasSome = [],
      skip,
      extendedLimit = 50,
      sortOrder,
      sortKey,
      isEmpty,
      isNotEmpty,
      startsWith = [],
      search,
      searchPrefix,
      correctionEnabled,
      searchType,
      not,
      log = false
    } = payload;

    // Create Wix client
    const client = await createWixClient();

    // Initialize query with collection ID
    let dataQuery = client.items.query(dataCollectionId);

    // Apply includes
    if (includeReferencedItems.length > 0) {
      includeReferencedItems.forEach(item => {
        dataQuery = dataQuery.include(item);
      });
    }

    // Apply filters
    if (not?.length === 2 && Array.isArray(not[1]) && not[1].length > 0) {
      dataQuery = dataQuery.not(client.items.filter().hasSome(not[0], not[1]));
    }

    if (contains?.length === 2) {
      dataQuery = dataQuery.contains(contains[0], contains[1]);
    }

    // Apply all equality filters
    eq.forEach(filter => {
      dataQuery = dataQuery.eq(filter.key, filter.value);
    });

    // Apply all inequality filters
    ne.forEach(filter => {
      dataQuery = dataQuery.ne(filter.key, filter.value);
    });

    // Apply all hasSome filters
    hasSome.forEach(filter => {
      dataQuery = dataQuery.hasSome(filter.key, filter.values);
    });

    // Apply all startsWith filters
    startsWith.forEach(filter => {
      dataQuery = dataQuery.startsWith(filter.key, filter.value);
    });

    // Apply isNotEmpty filter
    if (isNotEmpty) {
      dataQuery = dataQuery.isNotEmpty(isNotEmpty);
    }

    if (isEmpty) {
      dataQuery = dataQuery.isEmpty(isEmpty);
    }

    // Apply skip for pagination
    if (skip) {
      dataQuery = dataQuery.skip(skip);
    }

    // Apply sorting
    if (sortKey) {
      dataQuery = sortOrder === "desc"
        ? dataQuery.descending(sortKey)
        : dataQuery.ascending(sortKey);
    }

    if (search?.length === 2) {
      let words = search[1].split(/\s+/).filter(Boolean);
      if (correctionEnabled) {
        const productKeywordsData = await queryCollection({ "dataCollectionId": "ProductKeywords" });
        const productKeywords = productKeywordsData.items[0]?.keywords || [];
        words = await Promise.all(words.map(word => correctSearchTerm(word, productKeywords)));
      }
      let newQuery = words.slice(1).reduce((query, word) =>
        query.contains(search[0], searchPrefix ? searchPrefix + word : word || ""),
        dataQuery
      );

      dataQuery = dataQuery.contains(search[0], searchPrefix ? searchPrefix + words[0] : words[0] || "");
      if (words.length > 1) {
        dataQuery = searchType === "or" ? dataQuery.or(newQuery) : dataQuery.and(newQuery);
      }
    };

    // Apply limit unless "infinite"
    const useInfiniteScroll = limit === "infinite";

    if (useInfiniteScroll) {
      dataQuery = dataQuery.limit(extendedLimit);
    } else if (limit) {
      dataQuery = dataQuery.limit(limit);
    }

    // Fetch data with retries
    const options = { returnTotalCount };
    let data = await retryAsyncOperation(() => dataQuery.find(options));

    // Handle "infinite" scenario by fetching all pages
    if (useInfiniteScroll) {
      const allItems = [...data.items];

      while (data.hasNext()) {
        data = await retryAsyncOperation(() => data.next());
        allItems.push(...data.items);
      }

      data.items = allItems;
    }

    return data;
  } catch (error) {
    logError(`Error fetching data from ${payload.dataCollectionId}: ${error}`);
    throw new Error(`Error fetching data from ${payload.dataCollectionId}: ${error.message}`);
  }
};

export default queryCollection;