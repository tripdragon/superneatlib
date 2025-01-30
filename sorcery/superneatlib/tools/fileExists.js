// const fs = require('fs');

// export function checkIfFileExists(filePath, two="") {
//   // const filePath = "./public/models/mesh.glb";
//
//
//   if (fs.existsSync(filePath)) {
//     console.log("File exists", two);
//   } else {
//     console.log("File does not exist");
//   }
// }


export async function checkIfFileExists(filePath, two="") {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    if (response.ok) {
      console.log("File exists:", filePath, two);
    } else {
      console.log("File does not exist:", filePath);
    }
  } catch (error) {
    console.error("Error checking file:", error);
  }
}

// Example usage
// checkIfFileExists("/public/models/mesh.glb");
