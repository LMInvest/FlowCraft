import { Priority } from './types';

export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    P0: '#ef4444',
    P1: '#f97316',
    P2: '#f59e0b',
    P3: '#84cc16',
    P4: '#06b6d4',
    P5: '#8b5cf6',
  };
  return colors[priority];
};

export const generateTaskId = (existingIds: string[]): string => {
  const numbers = existingIds
    .filter(id => id.startsWith('TSK-'))
    .map(id => parseInt(id.split('-')[1]))
    .filter(n => !isNaN(n));

  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const newNumber = maxNumber + 1;
  return `TSK-${String(newNumber).padStart(3, '0')}`;
};

export const generateSprintId = (existingIds: string[]): string => {
  const numbers = existingIds
    .filter(id => id.startsWith('SPR-'))
    .map(id => parseInt(id.split('-')[1]))
    .filter(n => !isNaN(n));

  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const newNumber = maxNumber + 1;
  return `SPR-${String(newNumber).padStart(3, '0')}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
