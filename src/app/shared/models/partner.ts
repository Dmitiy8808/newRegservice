export interface Partner {
  Id: number;
  Name: string;
  Inn: string;
  Kpp: string;
  Email: string | null;
  Article: string | null;
  IdentPointInfos: IdentPointInfo[];
  IsIdentificationCenter: boolean;
}

export interface IdentPointInfo {
  Id: number;
  AgentId: number;
  Name: string;
  Phone: string;
  ContactPerson: string;
  Email: string;
  Enabled: boolean;
  Address: Address;
  AddressString: string;
}

export interface Address {
  addrId: number;
  regionId: number;
  postalCode: string;
  area: string | null;
  city: string;
  locality: string;
  street: string;
  building: string;
  bulk: string | null;
  flat: string | null;
  isPostalType: boolean;

}
