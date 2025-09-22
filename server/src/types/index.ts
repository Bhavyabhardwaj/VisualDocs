export * from './user';
export * from './project';
export * from './auth';
export * from './events';
export * from './analysis';
export * from './diagram';
export * from './api';

export type EntityWithTimestamps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PartialUpdate<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

export type PaginationOptions = {
  page: number;
  limit: number;
  sort?: string | undefined;
  order?: 'asc' | 'desc' | undefined;
};

export type QueryFilters = {
  search?: string;
  status?: string;
  language?: string;
  dateFrom?: Date;
  dateTo?: Date;
};