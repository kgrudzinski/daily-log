import { useFilterControl, useFilter } from ".";

export function Table({ columns, data, filterRow = true }) {
  const { applyFilter } = useFilter();

  const _data = filterRow ? applyFilter(data) : data;

  return (
    <table className="table is-striped is-fullwidth">
      <thead>
        <tr>
          {columns.map((col) => {
            return <th key={col.field}>{col.label}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {filterRow ? <FilterRow columns={columns} /> : null}
        {_data.map((row) => {
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

function FilterRow({ columns }) {
  return (
    <tr>
      {columns.map((col, index) => {
        const col_id = col.field ? col.field : index;
        return <FilterCell key={`filter_${col_id}`} column={col} />;
      })}
    </tr>
  );
}

function FilterCell({ column }) {
  const { filters, updateFilter } = useFilterControl();
  const { field: name, label, filterable } = column;

  const value = filterable ? filters[name] || "" : "";

  const onChange = (evt) => {
    updateFilter({ name: evt.target.name, value: evt.target.value });
  };

  return (
    <td>
      {filterable ? (
        <input
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          style={{ width: "100%" }}
          autoComplete="off"
          aria-autocomplete="none"
          placeholder={label}
        />
      ) : null}
    </td>
  );
}
