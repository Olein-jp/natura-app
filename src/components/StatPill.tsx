type StatPillProps = {
  label: string;
  value: string | number;
  tone?: 'neutral' | 'success' | 'danger' | 'warning';
};

export function StatPill({ label, value, tone = 'neutral' }: StatPillProps) {
  return (
    <div className={`stat-pill stat-pill-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
