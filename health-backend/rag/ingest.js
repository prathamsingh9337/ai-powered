const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

async function loadDocuments() {

  const docsPath =
    path.join(__dirname, "docs");

  const files =
    fs.readdirSync(docsPath);

  let documents = [];

  for (const file of files) {

    const dataBuffer =
      fs.readFileSync(
        path.join(docsPath, file)
      );

    const pdfData =
      await pdfParse(dataBuffer);

    documents.push({
      content: pdfData.text,
      source: file,
    });
  }

  return documents;
}

module.exports = loadDocuments;