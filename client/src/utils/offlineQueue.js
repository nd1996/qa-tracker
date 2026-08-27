const STORAGE_KEY = 'qa_offline_inspections';

export const getOfflineQueue = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToOfflineQueue = (inspection) => {
  const queue = getOfflineQueue();
  queue.push({ ...inspection, offlineId: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(STORAGE_KEY);
};
