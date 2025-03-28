import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function FileConverter() {
  const [jsonData, setJsonData] = useState(null);
  const [fileNameBase, setFileNameBase] = useState('converted_contacts');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setJsonData(results.data);
        const name = file.name.replace(/\.[^/.]+$/, ''); // remove extension
        setFileNameBase(`converted_${name}`);
      },
    });
  };

  const downloadJSON = () => {
    if (!jsonData) return;
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    saveAs(jsonBlob, `${fileNameBase}.json`);
  };

  const downloadExcel = () => {
    if (!jsonData) return;

    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, `${fileNameBase}.xlsx`);
  };

  const downloadCSV = () => {
    if (!jsonData) return;

    const csv = Papa.unparse(jsonData);
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, `${fileNameBase}.csv`);
  };
  const downloadVCard = () => {
    if (!jsonData) return;
  
    const vcards = jsonData.map((contact) => {
      const name = contact.Name || contact.FullName || '';
      const phone = contact.Phone || contact['Phone Number'] || '';
      const email = contact.Email || contact['Email Address'] || '';
  
      return `BEGIN:VCARD
  VERSION:3.0
  FN:${name}
  TEL;TYPE=CELL:${phone}
  EMAIL:${email}
  END:VCARD`;
    });
  
    const blob = new Blob([vcards.join('\n')], { type: 'text/vcard;charset=utf-8' });
    saveAs(blob, `${fileNameBase}.vcf`);
  };
  
  return (
    <div className="file-converter-page">
      <h2>CSV File Converter</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {jsonData && (
        <div style={{ marginTop: '1em' }}>
          <button onClick={downloadCSV} style={{ marginRight: '1em' }}>
            Download as CSV
          </button>
          <button onClick={downloadJSON} style={{ marginRight: '1em' }}>
            Download as JSON
          </button>
          <button onClick={downloadExcel}>
            Download as Excel
          </button>
          <button onClick={downloadVCard} style={{ backgroundColor: '#6f42c1' }}>
  Download as vCard (.vcf)
</button>


          <pre style={{ maxHeight: 300, overflow: 'auto' }}>
            {JSON.stringify(jsonData.slice(0, 5), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default FileConverter;
