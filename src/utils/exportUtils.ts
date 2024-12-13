export const exportToCSV = (data: any[], filename: string) => {
  // Define headers based on the table structure
  const headers = ['Port Name', 'LOCODE', 'Country', 'Distance (km)', 'Distance (nm)'];
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.name}"`,
      row.locode,
      row.countryCode,
      Math.round(row.distance),
      Math.round(row.distance / 1.852)
    ].join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
