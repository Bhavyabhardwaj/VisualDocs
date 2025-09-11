export * from './user';
export * from './project';
export * from './auth';
export * from './api';

export type EntityWithTimestamps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PartialUpdate<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
