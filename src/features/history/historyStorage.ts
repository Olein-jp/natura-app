import type { TourHistory } from '../../types';

const STORAGE_KEY = 'natura-tour-histories';

export function loadTourHistories(): TourHistory[] {
  try {
    const rawHistories = window.localStorage.getItem(STORAGE_KEY);
    if (rawHistories === null) {
      return [];
    }

    const parsedHistories = JSON.parse(rawHistories);
    return Array.isArray(parsedHistories) ? parsedHistories : [];
  } catch {
    return [];
  }
}

export function saveTourHistories(histories: TourHistory[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(histories));
}
