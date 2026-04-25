import { type CSSProperties, useState } from 'react';
import type { Grade, TourSettings } from '../../types';
import { gradeOptions } from './problemData';

type TourSetupPageProps = {
  onStart: (settings: TourSettings) => void;
  onOpenHistory: () => void;
  historyCount: number;
};

export function TourSetupPage({ onStart, onOpenHistory, historyCount }: TourSetupPageProps) {
  const [grade, setGrade] = useState<Grade>('7~8Q 20課題');
  const [maxTries, setMaxTries] = useState(3);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);

  return (
    <main className="page-shell setup-page">
      <section className="section-heading setup-heading">
        <div>
          <p className="eyebrow">Tour setup</p>
          <h1>ツアー設定</h1>
        </div>
        <button className="secondary-action" type="button" onClick={onOpenHistory}>
          過去の履歴を見る（{historyCount}件）
        </button>
      </section>

      <form
        className="setup-form"
        onSubmit={(event) => {
          event.preventDefault();
          onStart({ grade, maxTries, timeLimitMinutes });
        }}
      >
        <fieldset>
          <legend>取り組む級</legend>
          <div className="segmented-grid">
            {gradeOptions.map((gradeOption) => (
              <label
                key={gradeOption.value}
                className={grade === gradeOption.value ? 'selected' : ''}
                style={{ '--grade-color': gradeOption.color } as CSSProperties}
              >
                <input
                  type="radio"
                  name="grade"
                  value={gradeOption.value}
                  checked={grade === gradeOption.value}
                  onChange={() => setGrade(gradeOption.value)}
                />
                <span>{gradeOption.value}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="number-fields">
          <label className="field">
            <span>上限トライ数</span>
            <input
              type="number"
              min="1"
              max="20"
              value={maxTries}
              onChange={(event) => setMaxTries(Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>制限時間（分）</span>
            <input
              type="number"
              min="1"
              max="240"
              value={timeLimitMinutes}
              onChange={(event) => setTimeLimitMinutes(Number(event.target.value))}
            />
          </label>
        </div>

        <button className="primary-action" type="submit">
          ツアーを開始
        </button>
      </form>
    </main>
  );
}
