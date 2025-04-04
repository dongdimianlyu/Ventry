const fs = require('fs');
const path = require('path');

// Helper function to walk through directory recursively
function walkSync(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = walkSync(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get all TypeScript files
const allTsFiles = walkSync('src');

// Update imports in each file
allTsFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Replace imports from @/lib/firebaseConfig to @/lib/firebaseConfig.js
    const updatedContent = content.replace(
      /from ['"]@\/lib\/firebaseConfig['"]/g, 
      'from \'@/lib/firebaseConfig.js\''
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('All imports updated successfully!'); 