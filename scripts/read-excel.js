const XLSX = require('xlsx');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '../sample-data/09-November-india.xlsx');
const workbook = XLSX.readFile(filePath);

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('=== EXCEL FILE ANALYSIS ===\n');
console.log('Sheet Name:', sheetName);
console.log('Total Rows:', data.length);
console.log('\n=== COLUMNS ===');
if (data.length > 0) {
  console.log(Object.keys(data[0]).join(', '));
}

console.log('\n=== FIRST 5 ROWS ===');
console.log(JSON.stringify(data.slice(0, 5), null, 2));

console.log('\n=== SAMPLE ROW STRUCTURE ===');
if (data.length > 0) {
  Object.entries(data[0]).forEach(([key, value]) => {
    console.log(`${key}: ${typeof value} = "${value}"`);
  });
}
