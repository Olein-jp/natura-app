import { StatPill } from '../../components/StatPill';
import type { ProblemResult, TourSettings } from '../../types';

type TourResultPageProps = {
  settings: TourSettings;
  results: ProblemResult[];
  elapsedSeconds: number;
  remainingSeconds: number;
  onRestart: () => void;
  onHome: () => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function TourResultPage({
  settings,
  results,
  elapsedSeconds,
  remainingSeconds,
  onRestart,
  onHome,
}: TourResultPageProps) {
  const completed = results.filter((result) => result.status === 'completed').length;
  const failed = results.filter((result) => result.status === 'failed').length;
  const unrecorded = results.filter((result) => result.status === null).length;
  const totalTries = results.reduce((sum, result) => sum + result.tries, 0);

  return (
    <main className="page-shell result-page">
      <section className="section-heading">
        <p className="eyebrow">Tour result</p>
        <h1>{settings.grade} ツアー結果</h1>
      </section>

      <section className="stats-row result-stats">
        <StatPill label="完登" value={completed} tone="success" />
        <StatPill label="未完登" value={failed} tone="danger" />
        <StatPill label="未入力" value={unrecorded} />
        <StatPill label="合計トライ" value={totalTries} />
        <StatPill label="経過時間" value={formatTime(elapsedSeconds)} tone="warning" />
        <StatPill label="残り時間" value={formatTime(remainingSeconds)} />
      </section>

      <section className="result-table" aria-label="課題別結果">
        <div className="result-table-head">
          <span>課題</span>
          <span>トライ</span>
          <span>結果</span>
        </div>
        {results.map((result) => (
          <div className="result-table-row" key={result.problemNumber}>
            <strong>{result.problemNumber}</strong>
            <span>{result.tries}</span>
            <span
              className={
                result.status === 'completed'
                  ? 'result-success'
                  : result.status === 'failed'
                    ? 'result-danger'
                    : 'result-muted'
              }
            >
              {result.status === 'completed'
                ? '完登'
                : result.status === 'failed'
                  ? '未完登'
                  : '未入力'}
            </span>
          </div>
        ))}
      </section>

      <div className="result-actions">
        <button className="secondary-action" type="button" onClick={onHome}>
          トップへ
        </button>
        <button className="primary-action" type="button" onClick={onRestart}>
          新しいツアー
        </button>
      </div>
    </main>
  );
}
