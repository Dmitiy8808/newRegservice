import { PluginVersion } from "./version";


export function isVersion(data: any): data is PluginVersion {
  return !Array.isArray(data) && 'version' in data;
}
