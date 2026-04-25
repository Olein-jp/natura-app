import { type CSSProperties, useMemo, useState } from 'react';
import type { Grade, ProblemSelectionMode, TourSettings } from '../../types';
import { gradeOptions, problemsByGrade } from './problemData';

type TourSetupPageProps = {
  onStart: (settings: TourSettings) => void;
  onOpenHistory: () => void;
  historyCount: number;
};

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parsePositiveInteger = (value: string) => {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const shuffleNumbers = (numbers: number[]) => {
  const shuffledNumbers = [...numbers];

  for (let index = shuffledNumbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledNumbers[index], shuffledNumbers[randomIndex]] = [
      shuffledNumbers[randomIndex],
      shuffledNumbers[index],
    ];
  }

  return shuffledNumbers;
};

export function TourSetupPage({ onStart, onOpenHistory, historyCount }: TourSetupPageProps) {
  const [grade, setGrade] = useState<Grade>('7~8Q 20課題');
  const [maxTries, setMaxTries] = useState('3');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState('30');
  const [problemSelectionMode, setProblemSelectionMode] = useState<ProblemSelectionMode>('all');
  const [rangeStart, setRangeStart] = useState('1');
  const [rangeEnd, setRangeEnd] = useState('10');
  const [randomCount, setRandomCount] = useState('10');
  const [validationError, setValidationError] = useState<string | null>(null);
  const gradeProblems = problemsByGrade[grade];
  const firstProblemNumber = gradeProblems[0];
  const lastProblemNumber = gradeProblems[gradeProblems.length - 1];
  const selectedProblemPreview = useMemo(() => {
    if (problemSelectionMode === 'all') {
      return `${firstProblemNumber}〜${lastProblemNumber}番（${gradeProblems.length}課題）`;
    }

    if (problemSelectionMode === 'range') {
      return `${rangeStart || '-'}〜${rangeEnd || '-'}番`;
    }

    return `${randomCount || '-'}課題をランダム`;
  }, [
    firstProblemNumber,
    gradeProblems.length,
    lastProblemNumber,
    problemSelectionMode,
    randomCount,
    rangeEnd,
    rangeStart,
  ]);

  const handleGradeChange = (nextGrade: Grade) => {
    const nextProblems = problemsByGrade[nextGrade];
    const nextLastProblemNumber = nextProblems[nextProblems.length - 1];

    setGrade(nextGrade);
    setRangeStart((currentValue) =>
      String(clampNumber(parsePositiveInteger(currentValue) ?? 1, 1, nextLastProblemNumber)),
    );
    setRangeEnd((currentValue) =>
      String(
        clampNumber(
          parsePositiveInteger(currentValue) ?? nextLastProblemNumber,
          1,
          nextLastProblemNumber,
        ),
      ),
    );
    setRandomCount((currentValue) =>
      String(clampNumber(parsePositiveInteger(currentValue) ?? 10, 1, nextProblems.length)),
    );
  };

  const buildProblemNumbers = () => {
    if (problemSelectionMode === 'all') {
      return gradeProblems;
    }

    if (problemSelectionMode === 'range') {
      const startNumber = parsePositiveInteger(rangeStart);
      const endNumber = parsePositiveInteger(rangeEnd);

      if (startNumber === null || endNumber === null) {
        setValidationError('始めと終わりの課題番号を入力してください。');
        return null;
      }

      if (
        startNumber < firstProblemNumber ||
        endNumber > lastProblemNumber ||
        startNumber > endNumber
      ) {
        setValidationError(
          `課題番号の範囲は ${firstProblemNumber}〜${lastProblemNumber} 番で指定してください。`,
        );
        return null;
      }

      return gradeProblems.filter(
        (problemNumber) => problemNumber >= startNumber && problemNumber <= endNumber,
      );
    }

    const count = parsePositiveInteger(randomCount);

    if (count === null || count > gradeProblems.length) {
      setValidationError(
        `ランダムで取り組む課題数は 1〜${gradeProblems.length} の間で入力してください。`,
      );
      return null;
    }

    return shuffleNumbers(gradeProblems).slice(0, count);
  };

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
          const parsedMaxTries = parsePositiveInteger(maxTries);
          const parsedTimeLimitMinutes = parsePositiveInteger(timeLimitMinutes);

          if (parsedMaxTries === null || parsedMaxTries > 20) {
            setValidationError('上限トライ数は 1〜20 の間で入力してください。');
            return;
          }

          if (parsedTimeLimitMinutes === null || parsedTimeLimitMinutes > 240) {
            setValidationError('制限時間は 1〜240 分の間で入力してください。');
            return;
          }

          const problemNumbers = buildProblemNumbers();

          if (problemNumbers === null) {
            return;
          }

          setValidationError(null);
          onStart({
            grade,
            maxTries: parsedMaxTries,
            timeLimitMinutes: parsedTimeLimitMinutes,
            problemSelectionMode,
            problemNumbers,
          });
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
                  onChange={() => handleGradeChange(gradeOption.value)}
                />
                <span>{gradeOption.value}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>取り組む課題</legend>
          <div className="selection-options">
            <label className={problemSelectionMode === 'all' ? 'selected' : ''}>
              <input
                type="radio"
                name="problemSelectionMode"
                value="all"
                checked={problemSelectionMode === 'all'}
                onChange={() => setProblemSelectionMode('all')}
              />
              <span>全ての課題</span>
            </label>
            <label className={problemSelectionMode === 'range' ? 'selected' : ''}>
              <input
                type="radio"
                name="problemSelectionMode"
                value="range"
                checked={problemSelectionMode === 'range'}
                onChange={() => setProblemSelectionMode('range')}
              />
              <span>指定の範囲</span>
            </label>
            <label className={problemSelectionMode === 'random' ? 'selected' : ''}>
              <input
                type="radio"
                name="problemSelectionMode"
                value="random"
                checked={problemSelectionMode === 'random'}
                onChange={() => setProblemSelectionMode('random')}
              />
              <span>ランダム</span>
            </label>
          </div>

          {problemSelectionMode === 'range' && (
            <div className="number-fields selection-number-fields">
              <label className="field">
                <span>始めの課題番号</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={firstProblemNumber}
                  max={lastProblemNumber}
                  value={rangeStart}
                  onChange={(event) => setRangeStart(event.target.value)}
                />
              </label>
              <label className="field">
                <span>終わりの課題番号</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={firstProblemNumber}
                  max={lastProblemNumber}
                  value={rangeEnd}
                  onChange={(event) => setRangeEnd(event.target.value)}
                />
              </label>
            </div>
          )}

          {problemSelectionMode === 'random' && (
            <label className="field selection-single-field">
              <span>取り組む課題数</span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max={gradeProblems.length}
                value={randomCount}
                onChange={(event) => setRandomCount(event.target.value)}
              />
            </label>
          )}

          <p className="selection-preview">選択中: {selectedProblemPreview}</p>
        </fieldset>

        <div className="number-fields">
          <label className="field">
            <span>上限トライ数</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="20"
              value={maxTries}
              onChange={(event) => setMaxTries(event.target.value)}
            />
          </label>
          <label className="field">
            <span>制限時間（分）</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="240"
              value={timeLimitMinutes}
              onChange={(event) => setTimeLimitMinutes(event.target.value)}
            />
          </label>
        </div>

        {validationError !== null && <p className="form-error">{validationError}</p>}

        <button className="primary-action" type="submit">
          ツアーを開始
        </button>
      </form>
    </main>
  );
}
