// Server-side version for Node.js execution
const fs = require('fs');

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

function calculatePercentage(a, b) {
  a = +a; b = +b;
  if (!a || !b) return 0;
  return (b - a) / a * 100;
}

function runAnalysis() {
  try {
    // Read data files
    const population = parseCSV(fs.readFileSync('raw/population.csv', 'utf8'));
    const quota = parseCSV(fs.readFileSync('raw/quota.csv', 'utf8'));
    const cutline = parseCSV(fs.readFileSync('raw/cutline.csv', 'utf8'));
    
    console.log('📊 Analysis Results:');
    console.log('Population records:', population.length);
    console.log('Quota records:', quota.length);
    console.log('Cutline records:', cutline.length);
    
    // Calculate trends
    const years = [...new Set(population.map(p => parseInt(p.year)))].sort();
    if (years.length >= 2) {
      const y2 = years[years.length - 1];
      const y1 = y2 - 1;
      
      const p2 = population.find(x => parseInt(x.year) === y2)?.cohort18;
      const p1 = population.find(x => parseInt(x.year) === y1)?.cohort18;
      const popChange = calculatePercentage(p1, p2);
      
      console.log(`Population change (${y1}→${y2}): ${popChange.toFixed(2)}%`);
    }
    
    // Generate summary
    const totalQuota = quota.reduce((sum, q) => sum + parseInt(q.quota || 0), 0);
    const avgCutline = cutline.length ? 
      cutline.reduce((sum, c) => sum + parseFloat(c.cut_pct || 0), 0) / cutline.length : 0;
    
    console.log('Total quota:', totalQuota);
    console.log('Average cutline:', avgCutline.toFixed(2));
    
    return {
      population_records: population.length,
      quota_records: quota.length,
      cutline_records: cutline.length,
      total_quota: totalQuota,
      average_cutline: avgCutline
    };
  } catch (error) {
    console.error('❌ Analysis error:', error);
    throw error;
  }
}

if (require.main === module) {
  runAnalysis();
}

module.exports = { runAnalysis, parseCSV, calculatePercentage };