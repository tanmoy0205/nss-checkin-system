type Row = {
  event: string;
  time: string;
  status: string;
};

export default function AttendanceTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">Event</th>
            <th className="p-2">Time</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{r.event}</td>
              <td className="p-2">{r.time}</td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
