type AppHeaderProps = {
  onHome: () => void;
};

export function AppHeader({ onHome }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="brand-button" type="button" onClick={onHome}>
        <strong>Natura Tools</strong>
      </button>
    </header>
  );
}
