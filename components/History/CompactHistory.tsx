// components/AuditHistoryCompact.jsx
import { useEffect, useState } from "react";

// models/AuditLog.ts
export interface AuditLog {
  id: number;
  tableName: string;
  recordId: string;
  operation: string;
  changedBy: string;
  changedAt: string;
  changes: string; // JSON string from backend
}

interface AuditHistoryCompactProps {
  tableName: string;
  recordId: string | number;
}

export default function AuditHistoryCompact({ tableName, recordId }: AuditHistoryCompactProps) {
  const [latest, setLatest] = useState<AuditLog | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [showFull, setShowFull] = useState<boolean>(false);
  const [fullHistory, setFullHistory] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tableName || !recordId) return;

    fetch(`/api/audit/${tableName}/${recordId}/latest`)
      .then((res) => res.json())
      .then((data) => {
        setLatest(data.latest);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [tableName, recordId]);

  const loadFullHistory = () => {
    setShowFull(true);
    fetch(`/api/audit/${tableName}/${recordId}`)
      .then((res) => res.json())
      .then((data: AuditLog[]) => setFullHistory(data));
  };

  if (loading) return <p>Loading history...</p>;
  if (!latest) return <p>No history available.</p>;

  const latestChanges: Record<string, { Old: string | null; New: string | null }> = latest.changes
    ? JSON.parse(latest.changes)
    : {};

  return (
    <div className="mt-6 border rounded bg-white p-4">
      <h3 className="text-lg font-semibold mb-2">Change History</h3>

      {/* Latest entry */}
      <div className="text-sm text-gray-700">
        <b>{latest.changedBy}</b> —{" "}
        {new Date(latest.changedAt).toLocaleString()} (
        <span className="font-medium">{latest.operation}</span>)
        <ul className="ml-4 mt-1 list-disc">
          {Object.entries(latestChanges).map(([field, diff]) => (
            <li key={field}>
              <span className="font-medium">{field}</span>:{" "}
              <span className="text-red-600 line-through">{diff.Old ?? "—"}</span>{" "}
              → <span className="text-green-600">{diff.New ?? "—"}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* View All Link */}
      {total > 1 && !showFull && (
        <button
          onClick={loadFullHistory}
          className="text-blue-600 text-sm mt-2 underline"
        >
          View all {total} changes
        </button>
      )}

      {/* Full History */}
      {showFull && (
        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Full History</h4>
            <button
              onClick={() => setShowFull(false)}
              className="text-gray-500 text-xs underline"
            >
              Collapse
            </button>
          </div>

          <ul className="divide-y divide-gray-200">
            {fullHistory.map((entry) => {
              const changes: Record<string, { Old: string | null; New: string | null }> = JSON.parse(entry.changes);
              return (
                <li key={entry.id} className="py-2">
                  <div className="text-sm text-gray-600">
                    <b>{entry.changedBy}</b> — {new Date(entry.changedAt).toLocaleString()} ({entry.operation})
                  </div>
                  <ul className="ml-4 mt-1 text-sm list-disc text-gray-800">
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
      )}
    </div>
  );
}
