export function Table({ columns, data }) {
  return (
    <table className="table is-fullwidth is-striped">
      <thead>
        <tr>
          {columns.map((col) => {
            return <th key={col.field}>{col.label}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return <TableRow key={row.id} row={row} columns={columns} />;
        })}
      </tbody>
    </table>
  );
}

function TableRow({ row, columns }) {
  return (
    <tr>
      {columns.map((col, idx) => {
        const col_id = col.field ? col.field : idx;
        return <TableCell key={`${row.id}_${col_id}`} row={row} column={col} />;
      })}
    </tr>
  );
}

function TableCell({ row, column }) {
  if (!column.field) {
    return <td>{column.render(row)}</td>;
  }

  const raw_value = row[column.field];
  const value = column.format ? column.format(raw_value) : raw_value;

  return <td style={{ verticalAlign: "middle" }}>{value}</td>;
}
