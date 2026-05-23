const {
  MemoryVectorStore,
} = require("langchain/vectorstores/memory");

const {
  RecursiveCharacterTextSplitter,
} = require("@langchain/textsplitters");

const {
  pipeline,
} = require("@xenova/transformers");

const loadDocuments =
  require("./ingest");

async function createRetriever() {

  const docs =
    await loadDocuments();

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

  const splitDocs =
    await splitter.createDocuments(
      docs.map(doc => doc.content)
    );

  // FREE EMBEDDINGS
  const extractor =
    await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

  const embeddings = {

    embedDocuments:
      async (texts) => {

      return Promise.all(
        texts.map(async (text) => {

          const output =
            await extractor(text, {
              pooling: "mean",
              normalize: true,
            });

          return Array.from(output.data);
        })
      );
    },

    embedQuery:
      async (text) => {

      const output =
        await extractor(text, {
          pooling: "mean",
          normalize: true,
        });

      return Array.from(output.data);
    },
  };

  // MEMORY VECTOR STORE
  const vectorStore =
    await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );

  return vectorStore.asRetriever();
}

module.exports =
  createRetriever;
