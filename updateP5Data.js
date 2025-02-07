const fs = require('fs');
const https = require('https');

const url = 'https://p5js.org/reference/data.json';

https.get(url, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    try {
      const jsonData = JSON.parse(data);

      if (!Array.isArray(jsonData)) {
        console.error('Expected an array from the JSON response.');
        return;
      }

      // Extract function names for keyword syntax highlighting
      const keywords = jsonData.map(entry => entry.name);

      // Write keywords to p5-keywords.js
      const keywordFileContent = `const keywords = ${JSON.stringify(keywords, null, 2)};`;
      fs.writeFileSync('client/utils/p5-keywords.js', keywordFileContent);
      console.log('Keywords updated successfully!');

      // Extract function name and descriptions for p5-hinter.js
      const hinterContent = jsonData.map(entry => ({
        name: entry.name,
        description: entry.description || "No description available"
      }));

      // Write hinter data to p5-hinter.js
      const hinterFileContent = `const hinterData = ${JSON.stringify(hinterContent, null, 2)};`;
      fs.writeFileSync('client/utils/p5-hinter.js', hinterFileContent);
      console.log('Hinter data updated successfully!');

    } catch (error) {
      console.error('Error parsing JSON:', error.message);
    }
  });

}).on('error', (error) => {
  console.error('Error fetching data:', error.message);
});
