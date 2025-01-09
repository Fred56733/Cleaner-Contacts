// Handles the downloading of the CSV
import Papa from 'papaparse';

export const downloadCSV = (contacts) => {
  const csv = Papa.unparse(contacts);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'contacts.csv';
  link.click();
  window.URL.revokeObjectURL(url);
};
