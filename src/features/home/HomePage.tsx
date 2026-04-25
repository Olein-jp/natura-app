type HomePageProps = {
  onOpenTour: () => void;
};

export function HomePage({ onOpenTour }: HomePageProps) {
  return (
    <main className="page-shell home-page">
      <section className="tool-grid" aria-label="ツール一覧">
        <button className="tool-card active-tool" type="button" onClick={onOpenTour}>
          <span className="tool-icon">01</span>
          <span>
            <strong>ツアー管理サービス</strong>
            <small>級、トライ数、時間を設定して課題結果を記録</small>
          </span>
        </button>
      </section>
    </main>
  );
}
