import { AppHeader } from './components/AppHeader';
import { HistoryPage } from './features/history/HistoryPage';
import { loadTourHistories, saveTourHistories } from './features/history/historyStorage';
import { HomePage } from './features/home/HomePage';
import { problemsByGrade } from './features/tour/problemData';
import { TourRecordPage } from './features/tour/TourRecordPage';
import { TourResultPage } from './features/tour/TourResultPage';
import { TourSetupPage } from './features/tour/TourSetupPage';
import type { ProblemResult, TourHistory, TourSettings } from './types';
import { useState } from 'react';

type Screen = 'home' | 'setup' | 'record' | 'result' | 'history';

type TourSummary = {
  historyId: string | null;
  results: ProblemResult[];
  elapsedSeconds: number;
  remainingSeconds: number;
};

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<TourSettings | null>(null);
  const [summary, setSummary] = useState<TourSummary | null>(null);
  const [histories, setHistories] = useState<TourHistory[]>(() => loadTourHistories());

  const goHome = () => {
    setScreen('home');
    setSettings(null);
    setSummary(null);
  };

  const startTour = (nextSettings: TourSettings) => {
    setSettings(nextSettings);
    setSummary(null);
    setScreen('record');
  };

  const finishTour = (
    results: ProblemResult[],
    elapsedSeconds: number,
    remainingSeconds: number,
  ) => {
    let historyId: string | null = null;

    if (settings !== null) {
      historyId = crypto.randomUUID();
      const nextHistory: TourHistory = {
        id: historyId,
        finishedAt: new Date().toISOString(),
        settings,
        results,
        elapsedSeconds,
        remainingSeconds,
      };
      const nextHistories = [nextHistory, ...histories];
      setHistories(nextHistories);
      saveTourHistories(nextHistories);
    }

    setSummary({ historyId, results, elapsedSeconds, remainingSeconds });
    setScreen('result');
  };

  const deleteHistory = (historyId: string) => {
    const nextHistories = histories.filter((history) => history.id !== historyId);
    setHistories(nextHistories);
    saveTourHistories(nextHistories);
  };

  const deleteCurrentResult = () => {
    if (summary?.historyId !== null && summary?.historyId !== undefined) {
      deleteHistory(summary.historyId);
    }

    goHome();
  };

  const initialResults =
    settings === null
      ? []
      : (settings.problemNumbers ?? problemsByGrade[settings.grade]).map((problemNumber) => ({
          problemNumber,
          tries: 1,
          status: null,
        }));

  return (
    <>
      <AppHeader onHome={goHome} />
      {screen === 'home' && <HomePage onOpenTour={() => setScreen('setup')} />}
      {screen === 'history' && (
        <HistoryPage histories={histories} onBack={goHome} onDeleteHistory={deleteHistory} />
      )}
      {screen === 'setup' && (
        <TourSetupPage
          onStart={startTour}
          onOpenHistory={() => setScreen('history')}
          historyCount={histories.length}
        />
      )}
      {screen === 'record' && settings !== null && (
        <TourRecordPage
          settings={settings}
          initialResults={initialResults}
          onFinish={finishTour}
        />
      )}
      {screen === 'result' && settings !== null && summary !== null && (
        <TourResultPage
          settings={settings}
          results={summary.results}
          elapsedSeconds={summary.elapsedSeconds}
          remainingSeconds={summary.remainingSeconds}
          onRestart={() => setScreen('setup')}
          onHome={goHome}
          onDeleteRecord={deleteCurrentResult}
        />
      )}
    </>
  );
}
