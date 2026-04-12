type Props = {
  name: string;
  email: string;
  course?: string;
};

export default function VolunteerCard({ name, email, course }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-sm">{email}</div>
      {course && <div className="text-sm">{course}</div>}
    </div>
  );
}
