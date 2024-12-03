let contacts = []; // Store all contacts globally
const seenContacts = new Map(); // Track unique contacts by a key for deduplication

document.getElementById('ViewButton').addEventListener('click', function () {
  handleFileUpload(previewCSV);
});

// Event listener for the upload button
document.getElementById('uploadButton').addEventListener('click', function () {
  handleFileUpload(addNewContacts);
  document.getElementById('downloadButton').disabled = false; // Enable download button after upload
});

// Event listener for the download button
document.getElementById('downloadButton').addEventListener('click', function () {
downloadCSV(contacts); // Download the current contact list as CSV
  });

// Function to handle file uploads and apply a callback
function handleFileUpload(callback) {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContent = e.target.result;
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        Papa.parse(fileContent, {
          header: true,
          complete: function (results) {
            callback(results.data);
          },
        });
      } else if (fileExtension === 'vcf') {
        try {
          const parsedVCF = ICAL.parse(fileContent);
          const vcfContacts = parsedVCF[1].map((card) => {
            const vcard = new ICAL.Component(card);
            const fn = vcard.getFirstPropertyValue('fn') || 'N/A';
            const emailProp = vcard.getAllProperties('email');
            const telProp = vcard.getAllProperties('tel');

            const email =
              emailProp.length > 0 ? emailProp[0].getFirstValue() : 'N/A';
            const tel =
              telProp.length > 0
                ? formatPhoneNumber(telProp[0].getFirstValue())
                : 'N/A';

            return { fn, email, tel };
          });

          callback(vcfContacts);
        } catch (error) {
          console.error('Error parsing VCF file:', error);
        }
      } else {
        alert('Unsupported file type. Please upload a CSV or VCF file.');
      }
    };
    reader.readAsText(file);
  } else {
    alert('Please select a file to upload.');
  }
}

// Function to just display the CSV data
function previewCSV(data) {
  displayContactsCSV(data); // Use the same display function
}

// Function to add new contacts to the existing list
function addNewContacts(newContacts) {
  newContacts.forEach((contact) => {
    const name = (contact.fn || contact['First Name'] || '')
      .toLowerCase()
      .trim();
    const email = (contact.email || contact['E-mail Address'] || '')
      .toLowerCase()
      .trim();
    const phone = formatPhoneNumber(
      contact['Mobile Phone'] || contact.tel || '',
    );
    const key = name + email;

    if (!seenContacts.has(key)) {
      // Format the contact's phone number before adding
      contact['Mobile Phone'] = phone;
      contact['tel'] = phone;
      seenContacts.set(key, contact);
      contacts.push(contact);
    } else {
      console.log('Duplicate or near-duplicate contact found:', contact);
    }
  });

  displayContactsCSV(contacts);
}

// Function to format phone numbers to (123) 456-7890
function formatPhoneNumber(phone) {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if the cleaned number has 10 digits
  if (cleaned.length === 10) {
    // Format as (123) 456-7890
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else {
    // Return the original phone number if it’s not 10 digits
    return phone;
  }
}

// Function to download contacts as a CSV file
function downloadCSV(contacts) {
  const csv = Papa.unparse(contacts);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'contacts.csv';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Function to display CSV contacts in the table
function displayContactsCSV(contacts) {
  const tableBody = document.getElementById('contactsBody');
  tableBody.innerHTML = '';

  contacts.forEach((contact) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent =
      (contact['First Name'] || contact.fn || '') +
      ' ' +
      (contact['Last Name'] || 'N/A');

    const emailCell = document.createElement('td');
    emailCell.textContent = contact['E-mail Address'] || contact.email || 'N/A';

    const phoneCell = document.createElement('td');
    phoneCell.textContent = contact['Mobile Phone'] || contact.tel || 'N/A';

    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    tableBody.appendChild(row);
  });
}
