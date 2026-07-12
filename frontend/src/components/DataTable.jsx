
import React from "react";

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found",
}) {
  if (loading) {
    return (
      <div className="bg-panel rounded-xl border border-border p-8 text-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-panel shadow-sm">
      <table className="min-w-full">
        <thead className="bg-panel2 border-b border-border">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-5 py-3 text-left text-sm font-semibold text-ink"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row._id || index}
                className="border-b border-border hover:bg-panel2 transition"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-5 py-4 text-sm text-ink"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}