import { Certificate } from "./certificate";


export function isCertificateArray(data: any): data is Certificate[] {
  return Array.isArray(data) && data.length > 0 && 'Thumbprint' in data[0];
}
