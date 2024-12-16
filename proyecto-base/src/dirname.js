import { fileURLToPath } from 'url'; // Import function to convert a file URL to a path.
import { dirname } from 'path'; // Import function to get the directory name from a path.

// Get the current file name from the module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = dirname(__filename);

// Export the directory name as the default export
export default __dirname;