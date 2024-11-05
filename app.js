document.getElementById('uploadButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        console.log('File selected:', file.name);
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;
            const fileExtension = file.name.split('.').pop().toLowerCase();

            console.log('File extension detected:', fileExtension);

            if (fileExtension === 'csv') {
                // Process CSV file
                Papa.parse(fileContent, {
                    header: true,
                    complete: function(results) {
                        console.log("Parsed CSV:", results.data);
                        displayContactsCSV(results.data);  // Display CSV contacts in table
                        checkConflicts(results.data);  // Check for name conflicts
                    }
                });
            } else if (fileExtension === 'vcf') {
                try {
                    // Use ical.js to parse the VCF content
                    const parsedVCF = ICAL.parse(fileContent);  // Parse the vCard data
                    console.log("Parsed VCF structure:", JSON.stringify(parsedVCF, null, 2));  // Log the parsed structure

                    const parsedContacts = parsedVCF[1].map(card => {
                        const vcard = new ICAL.Component(card);

                        // Check and fetch properties
                        const fn = vcard.getFirstPropertyValue('fn') || 'N/A';
                        const emailProp = vcard.getAllProperties('email');
                        const telProp = vcard.getAllProperties('tel');

                        // Handle multiple emails or phone numbers (if present)
                        const email = emailProp.length > 0 ? emailProp[0].getFirstValue() : 'N/A';
                        const tel = telProp.length > 0 ? telProp[0].getFirstValue() : 'N/A';

                        return { fn, email, tel };
                    });

                    displayContactsVCF(parsedContacts);  // Display VCF contacts in table
                    checkConflicts(parsedContacts);  // Check for name conflicts
                } catch (error) {
                    console.error("Error parsing VCF file:", error);
                }
            } else {
                alert('Unsupported file type. Please upload a CSV or VCF file.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a file to upload.');
    }
});

// Function to display CSV contacts in the table
function displayContactsCSV(contacts) {
    const tableBody = document.getElementById('contactsBody');
    tableBody.innerHTML = '';  // Clear previous data

    console.log("Displaying CSV contacts:", contacts);  // Log the contacts to display

    contacts.forEach(contact => {
        const row = document.createElement('tr');

        // Create table cells for CSV contact info
        const nameCell = document.createElement('td');
        nameCell.textContent = (contact['First Name'] || '') + ' ' + (contact['Last Name'] || 'N/A');

        const emailCell = document.createElement('td');
        emailCell.textContent = contact['E-mail Address'] || 'N/A';

        const phoneCell = document.createElement('td');
        phoneCell.textContent = contact['Mobile Phone'] || 'N/A';

        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);

        // Append row to the table body
        tableBody.appendChild(row);
    });
}

// Function to display VCF contacts in the table
function displayContactsVCF(contacts) {
    const tableBody = document.getElementById('contactsBody');
    tableBody.innerHTML = '';  // Clear previous data

    console.log("Displaying VCF contacts:", contacts);  // Log the contacts to display

    contacts.forEach(contact => {
        const row = document.createElement('tr');

        // Create table cells for VCF contact info
        const nameCell = document.createElement('td');
        nameCell.textContent = contact.fn || 'N/A';

        const emailCell = document.createElement('td');
        emailCell.textContent = contact.email || 'N/A';

        const phoneCell = document.createElement('td');
        phoneCell.textContent = contact.tel || 'N/A';

        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);

        // Append row to the table body
        tableBody.appendChild(row);
    });
}
