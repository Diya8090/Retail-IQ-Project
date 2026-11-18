export const exportToCSV = (filename, rows, columns) => {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const columnHeaders = columns.map((col) => `"${col.label || col.key}"`).join(',');
  const rowData = rows.map((row) => {
    return columns
      .map((col) => {
        let value = typeof col.accessor === 'function' ? col.accessor(row) : row[col.key];
        if (value === null || value === undefined) value = '';
        const stringVal = String(value).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [columnHeaders, ...rowData].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
