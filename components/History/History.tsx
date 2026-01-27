// components/AuditHistoryList.tsx
import { useEffect, useState } from "react";
import { AuditLog } from "./CompactHistory";

interface AuditHistoryListProps {
  tableName: string;
  recordId: string | number;
}

export default function AuditHistoryList({ tableName, recordId }: AuditHistoryListProps) {
  const [history, setHistory] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tableName || !recordId) return;

    fetch(`/api/audit/${tableName}/${recordId}`)
      .then((res) => res.json())
      .then((data: AuditLog[]) => setHistory(data))
      .finally(() => setLoading(false));
  }, [tableName, recordId]);

  if (loading) return <p>Loading history...</p>;
  if (!history.length) return <p>No changes recorded yet.</p>;

  return (
    <div className="bg-white rounded border p-4 mt-4">
      <h3 className="text-lg font-semibold mb-3">Change History</h3>

      <ul className="divide-y divide-gray-200">
        {history.map((entry) => {
          const changes: Record<string, { Old: string | null; New: string | null }> = JSON.parse(entry.changes);
          return (
            <li key={entry.id} className="py-2">
              <div className="text-sm text-gray-600">
                <b>{entry.changedBy}</b> — {new Date(entry.changedAt).toLocaleString()} ({entry.operation})
              </div>
              <ul className="ml-4 mt-1 text-sm text-gray-800 list-disc">
                {Object.entries(changes).map(([field, diff]) => (
                  <li key={field}>
                    <span className="font-medium">{field}</span>:{" "}
                    <span className="text-red-600 line-through">{diff.Old ?? "—"}</span>{" "}
                    → <span className="text-green-600">{diff.New ?? "—"}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
