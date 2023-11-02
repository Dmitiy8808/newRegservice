export interface Agent {
  id: number;
  cell: string[];
}


export interface AgentsResponse {
  totalpages: number;
  page: number;
  totalrecords: number;
  rows: Agent[];
}
