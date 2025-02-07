import { deleteFolderRecursive } from './utils/script.utils.js';

for (const path of ['dist']) {
    deleteFolderRecursive(path);
}
