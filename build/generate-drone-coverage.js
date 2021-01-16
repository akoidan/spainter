const NYC = require('nyc');
const config = require('../.nycrc.json');

Promise.resolve().then(() => {
  config.tempDirectory = config["temp-dir"]; // nyc config requires camelCase tempDir
  const nyc = new NYC(config);
  return nyc.getCoverageMapFromAllCoverageFiles();
}).then(map => {
  let coverage = map.getCoverageSummary();
  for (let a in coverage.data) {
    console.log(`coverage-${a} ${coverage.data[a].pct >= config[a]} ${coverage.data[a].pct}%`)
  }
}).catch(e => {
  console.error(e);
  process.exit(1);
});
