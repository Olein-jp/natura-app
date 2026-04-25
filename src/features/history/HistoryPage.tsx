import { useState } from 'react';
import { StatPill } from '../../components/StatPill';
import type { TourHistory } from '../../types';

type HistoryPageProps = {
  histories: TourHistory[];
  onBack: () => void;
  onDeleteHistory: (historyId: string) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getSummary(history: TourHistory) {
  const completedResults = history.results.filter((result) => result.status === 'completed');
  const completed = completedResults.length;
  const failed = history.results.filter((result) => result.status === 'failed').length;
  const unrecorded = history.results.filter((result) => result.status === null).length;
  const averageCompletedTries =
    completed === 0
      ? '-'
      : (
          completedResults.reduce((sum, result) => sum + result.tries, 0) / completed
        ).toFixed(1);

  return { completed, failed, unrecorded, averageCompletedTries };
}

export function HistoryPage({ histories, onBack, onDeleteHistory }: HistoryPageProps) {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    histories[0]?.id ?? null,
  );
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const selectedHistory =
    histories.find((history) => history.id === selectedHistoryId) ?? histories[0] ?? null;
  const selectedSummary = selectedHistory === null ? null : getSummary(selectedHistory);
  const deleteTarget = histories.find((history) => history.id === deleteTargetId) ?? null;

  const deleteHistory = () => {
    if (deleteTarget === null) {
      return;
    }

    onDeleteHistory(deleteTarget.id);
    setDeleteTargetId(null);

    if (selectedHistoryId === deleteTarget.id) {
      const nextSelectedHistory = histories.find((history) => history.id !== deleteTarget.id);
      setSelectedHistoryId(nextSelectedHistory?.id ?? null);
    }
  };

  return (
    <main className="page-shell history-page">
      <section className="section-heading history-heading">
        <div>
          <h1>ツアー履歴</h1>
        </div>
        <button className="secondary-action" type="button" onClick={onBack}>
          トップへ戻る
        </button>
      </section>

      {histories.length === 0 ? (
        <section className="empty-history">
          <p>まだ保存されたツアー履歴はありません。</p>
        </section>
      ) : (
        <div className="history-layout">
          <section className="history-list" aria-label="履歴一覧">
            {histories.map((history) => {
              const summary = getSummary(history);

              return (
                <article
                  className={`history-item ${history.id === selectedHistory?.id ? 'selected' : ''}`}
                  key={history.id}
                >
                  <button
                    className="history-item-main"
                    type="button"
                    onClick={() => setSelectedHistoryId(history.id)}
                  >
                    <span>{formatDate(history.finishedAt)}</span>
                    <strong>{history.settings.grade}</strong>
                    <small>
                      完登 {summary.completed} / 未完登 {summary.failed} / 未入力{' '}
                      {summary.unrecorded}
                    </small>
                  </button>
                  <button
                    className="history-delete-button"
                    type="button"
                    aria-label={`${formatDate(history.finishedAt)} ${history.settings.grade} の履歴を削除`}
                    onClick={() => setDeleteTargetId(history.id)}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v5" />
                      <path d="M14 11v5" />
                    </svg>
                  </button>
                </article>
              );
            })}
          </section>

          {selectedHistory !== null && selectedSummary !== null && (
            <section className="history-detail" aria-label="履歴詳細">
              <div className="history-detail-title">
                <span>{formatDate(selectedHistory.finishedAt)}</span>
                <h2>{selectedHistory.settings.grade}</h2>
              </div>

              <div className="stats-row history-stats">
                <StatPill label="完登" value={selectedSummary.completed} tone="success" />
                <StatPill label="未完登" value={selectedSummary.failed} tone="danger" />
                <StatPill label="未入力" value={selectedSummary.unrecorded} />
                <StatPill
                  label="平均完登トライ数"
                  value={selectedSummary.averageCompletedTries}
                />
                <StatPill label="経過時間" value={formatTime(selectedHistory.elapsedSeconds)} />
              </div>

              <section className="result-table" aria-label="履歴の課題別結果">
                <div className="result-table-head">
                  <span>課題</span>
                  <span>トライ</span>
                  <span>結果</span>
                </div>
                {selectedHistory.results.map((result) => (
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
            </section>
          )}
        </div>
      )}

      {deleteTarget !== null && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-history-title"
          >
            <h2 id="delete-history-title">履歴を削除しますか？</h2>
            <p>
              {formatDate(deleteTarget.finishedAt)} の {deleteTarget.settings.grade} を削除します。
              この操作は元に戻せません。
            </p>
            <div className="dialog-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={() => setDeleteTargetId(null)}
              >
                キャンセル
              </button>
              <button className="danger-action" type="button" onClick={deleteHistory}>
                削除する
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
