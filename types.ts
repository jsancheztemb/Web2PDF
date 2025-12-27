
export interface PageInfo {
  title: string;
  url: string;
  relevance: number;
  description: string;
}

export interface ManualChapter {
  id: string;
  title: string;
  pages: PageInfo[];
  summary: string;
}

export interface ManualStructure {
  siteTitle: string;
  chapters: ManualChapter[];
  totalEstimatedPages: number;
  scrapingStrategy: string[];
}

export enum ScrapingStatus {
  IDLE = 'IDLE',
  DISCOVERY = 'DISCOVERY',
  ANALYZING = 'ANALYZING',
  STRUCTURING = 'STRUCTURING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
