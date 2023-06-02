import { Season } from './curriculum';

export interface Workspace {
  id: number;
  name: string;
  code: string;
  currentTerm: CurrentTerm;
  foundedYear: number;
  slotDurationInMin: number;
  restTimeInMin: number;
  domain: string;
  morningStartTime: string;
  morningEndTime: string;
  afternoonStartTime: string;
  afternoonEndTime: string;
  emailSuffix: string;
}
export interface CurrentTerm {
  id: number;
  season: Season;
  year: string;
  startDate: null;
  endDate: null;
  state: string;
}
