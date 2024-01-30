import fs from "fs";

import path from "path";

export function convertTsxToJsx(directoryPath: string) {
  // Read all files in the given directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Loop through each file
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      // Check if it's a directory or a file
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error checking file stats:", err);
          return;
        }

        if (stats.isDirectory()) {
          // If it's a directory, recursively call the function
          convertTsxToJsx(filePath);
        } else if (path.extname(filePath) === ".tsx") {
          // If it's a .tsx file, rename it to .jsx
          const newFilePath = filePath.replace(/\.tsx$/, ".jsx");
          fs.rename(filePath, newFilePath, (err) => {
            if (err) {
              console.error(`Error renaming file ${filePath}:`, err);
            } else {
              console.log(`Converted ${filePath} to ${newFilePath}`);
            }
          });
        }
      });
    });
  });
}
