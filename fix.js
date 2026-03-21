const fs = require('fs');
let content = fs.readFileSync('src/App.css', 'utf-8');
const lines = content.split('\n');
lines[269] = lines[269].replace(/}.*/, '}');
fs.writeFileSync('src/App.css', lines.join('\n'));
console.log('Fixed CSS line 270');
