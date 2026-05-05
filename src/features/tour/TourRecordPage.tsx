import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { StatPill } from '../../components/StatPill';
import type { ProblemResult, TourSettings } from '../../types';
import { getGradeOption } from './problemData';

type TourRecordPageProps = {
  settings: TourSettings;
  initialResults: ProblemResult[];
  onFinish: (results: ProblemResult[], elapsedSeconds: number, remainingSeconds: number) => void;
};

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function TourRecordPage({ settings, initialResults, onFinish }: TourRecordPageProps) {
  const gradeOption = getGradeOption(settings.grade);
  const totalSeconds = settings.timeLimitMinutes * 60;
  const tourStartedAtMs = useRef(Date.now());
  const [results, setResults] = useState<ProblemResult[]>(initialResults);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [unrecordedNumbers, setUnrecordedNumbers] = useState<number[]>([]);

  const getCurrentTourTime = () => {
    const elapsedSeconds = Math.max(
      0,
      Math.floor((Date.now() - tourStartedAtMs.current) / 1000),
    );

    return {
      elapsedSeconds,
      remainingSeconds: Math.max(0, totalSeconds - elapsedSeconds),
    };
  };

  const syncTourTime = () => {
    const nextTourTime = getCurrentTourTime();
    setElapsedSeconds(nextTourTime.elapsedSeconds);
    setRemainingSeconds(nextTourTime.remainingSeconds);

    return nextTourTime;
  };

  useEffect(() => {
    const timerId = window.setInterval(syncTourTime, 1000);
    window.addEventListener('focus', syncTourTime);
    window.addEventListener('pageshow', syncTourTime);
    document.addEventListener('visibilitychange', syncTourTime);

    syncTourTime();

    return () => {
      window.clearInterval(timerId);
      window.removeEventListener('focus', syncTourTime);
      window.removeEventListener('pageshow', syncTourTime);
      document.removeEventListener('visibilitychange', syncTourTime);
    };
  }, [totalSeconds]);

  const stats = useMemo(() => {
    const completedResults = results.filter((result) => result.status === 'completed');
    const completed = completedResults.length;
    const completedTryTotal = completedResults.reduce((sum, result) => sum + result.tries, 0);
    const failed = results.filter((result) => result.status === 'failed').length;
    const averageCompletedTries =
      completed === 0 ? '-' : (completedTryTotal / completed).toFixed(1);

    return { completed, failed, averageCompletedTries };
  }, [results]);

  const updateProblem = (problemNumber: number, changes: Partial<ProblemResult>) => {
    setResults((currentResults) =>
      currentResults.map((result) =>
        result.problemNumber === problemNumber ? { ...result, ...changes } : result,
      ),
    );
  };

  const handleFinish = () => {
    const currentTourTime = syncTourTime();
    const unrecordedNumbers = results
      .filter((result) => result.status === null)
      .map((result) => result.problemNumber);

    if (unrecordedNumbers.length > 0) {
      setUnrecordedNumbers(unrecordedNumbers);
      return;
    }

    onFinish(results, currentTourTime.elapsedSeconds, currentTourTime.remainingSeconds);
  };

  const forceFinish = () => {
    const currentTourTime = syncTourTime();
    setUnrecordedNumbers([]);
    onFinish(results, currentTourTime.elapsedSeconds, currentTourTime.remainingSeconds);
  };

  return (
    <main
      className="record-layout"
      style={
        {
          '--tour-color': gradeOption.color,
          '--tour-contrast': gradeOption.contrastColor,
        } as CSSProperties
      }
    >
      <section className="record-toolbar">
        <div>
          <h1>{settings.grade} ツアー</h1>
        </div>
        <div className="timer-panel" aria-label="残り時間">
          <span>残り時間</span>
          <strong className={remainingSeconds === 0 ? 'time-up' : ''}>
            {formatTime(remainingSeconds)}
          </strong>
        </div>
      </section>

      <section className="stats-row" aria-label="記録状況">
        <StatPill label="完登" value={stats.completed} tone="success" />
        <StatPill label="未完登" value={stats.failed} tone="danger" />
        <StatPill label="平均完登トライ数" value={stats.averageCompletedTries} />
        <StatPill label="上限トライ数" value={`${settings.maxTries} try`} tone="warning" />
      </section>

      <section className="problem-list" aria-label="課題一覧">
        {results.map((result) => (
          <article className="problem-row" key={result.problemNumber}>
            <div className="problem-number">
              <strong>{result.problemNumber}</strong>
            </div>

            <button
              className="compact-button"
              type="button"
              aria-label={`${result.problemNumber}番のトライ数を減らす`}
              disabled={result.tries <= 1}
              onClick={() =>
                updateProblem(result.problemNumber, { tries: Math.max(1, result.tries - 1) })
              }
            >
              -
            </button>
            <strong className="try-count" aria-label={`${result.problemNumber}番のトライ数`}>
              {result.tries}
            </strong>
            <button
              className="compact-button"
              type="button"
              aria-label={`${result.problemNumber}番のトライ数を増やす`}
              onClick={() =>
                updateProblem(result.problemNumber, {
                  tries: Math.min(settings.maxTries, result.tries + 1),
                })
              }
            >
              +
            </button>
            <button
              className={`status-button ${result.status === 'completed' ? 'selected success' : ''}`}
              type="button"
              onClick={() => updateProblem(result.problemNumber, { status: 'completed' })}
            >
              完登
            </button>
            <button
              className={`status-button ${result.status === 'failed' ? 'selected danger' : ''}`}
              type="button"
              onClick={() => updateProblem(result.problemNumber, { status: 'failed' })}
            >
              未完登
            </button>
          </article>
        ))}
      </section>

      <div className="sticky-actions">
        <button className="primary-action" type="button" onClick={handleFinish}>
          ツアーを終了
        </button>
      </div>

      {unrecordedNumbers.length > 0 && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="force-finish-title"
          >
            <h2 id="force-finish-title">未入力の課題があります</h2>
            <p>{unrecordedNumbers.join(', ')} 番が未入力です。</p>
            <div className="dialog-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={() => setUnrecordedNumbers([])}
              >
                スコア入力に戻る
              </button>
              <button className="primary-action" type="button" onClick={forceFinish}>
                強制的に終了
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
