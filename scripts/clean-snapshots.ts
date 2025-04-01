import { deleteFolderRecursive } from './utils/script.utils.js';

for (const path of ['tests/integration/snapshots']) {
    deleteFolderRecursive(path);
}
