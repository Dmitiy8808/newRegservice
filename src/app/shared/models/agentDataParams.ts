export class AgentDataParams {
  _search = false;
  nd = new Date().getTime(); // Setting the current timestamp
  rows = 20;
  page = 1;
  sidx = 'AgentName';
  sord = 'asc';
  Page = 1;
  Rows = 20;
  Sidx = 'AgentName';
  Sord = 'asc';
  Login: string | null = null;
  PersonId = -1;
  PersonFio = null;
  Snils = null;
  AgentId = -1;
  AgentName: string | null = null;
  IsIdentCenter = null;
  Inn: string | null = null;
  Kpp = null;

}
