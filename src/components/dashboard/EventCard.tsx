type Props = {
  title: string;
  location: string;
  date: string;
};

export default function EventCard({ title, location, date }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm">{location}</div>
      <div className="text-sm">{date}</div>
    </div>
  );
}
