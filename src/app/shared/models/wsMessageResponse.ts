import { Certificate } from "./certificate";
import { PluginVersion } from "./version";


export interface WSMessageResponse {
  Success: boolean
  Message: any
  Data: Certificate[] | PluginVersion | string;
}
