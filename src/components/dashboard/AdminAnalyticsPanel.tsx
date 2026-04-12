type Metric = {
  label: string;
  value: number;
};

export default function AdminAnalyticsPanel({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map((m, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="text-sm">{m.label}</div>
          <div className="text-2xl font-semibold">{m.value}</div>
        </div>
      ))}
    </div>
  );
}
