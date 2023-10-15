import {fileURLToPath} from "url"; 
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
//esto devuelve el path del archivo
export const __dirname = dirname(__filename); 