// Updated tableData mapping with merged columns
const tableData = [
    {
        name: "Combined Table", // Combines data from columns 0, 3, and 6
        files: [
            "Nifty 50 Prediction 2025-03-28.csv",
            "Nifty Fin Services Prediction 2025-03-28.csv",
            "Nifty Infra Prediction 2025-03-28.csv",
        ],
    },
    { name: "Nifty IT", file: "Nifty IT Prediction 2025-03-28.csv" },
    { name: "Nifty Auto", file: "Nifty Auto Prediction 2025-03-28.csv" },
    { name: "Nifty FMCG", file: "Nifty FMCG Prediction 2025-03-28.csv" },
    { name: "Nifty Metal", file: "Nifty Metal Prediction 2025-03-28.csv" },
    { name: "Nifty Bank", file: "Nifty Bank Prediction 2025-03-28.csv" },
];

// Folder path for CSV files
const folderPath = './2025-03-28/';

// Function to render the table layout
function renderTableLayout() {
    const container = document.getElementById('tableContainer');
    container.innerHTML = ''; // Clear the container

    const table = document.createElement('table');
    table.classList.add('main-table');

    // Add table header
    const headerRow = document.createElement('tr');
    const header = document.createElement('th');
    header.setAttribute('colspan', 3); // Adjusting colspan for a 3-column layout
    header.textContent = "Predictions for 28-March-25";
    header.style.textAlign = "center";
    headerRow.appendChild(header);
    table.appendChild(headerRow);

    // Dynamically create rows and cells for the 3x2 layout
    const columnsPerRow = 3; // Number of columns per row
    let currentRow = null;

    tableData.forEach((_, index) => {
        if (index % columnsPerRow === 0) {
            // Create a new row every 3 items
            currentRow = document.createElement('tr');
            table.appendChild(currentRow);
        }

        // Create a cell for the current table
        const cell = document.createElement('td');
        cell.id = `table-${index}`; // Assign an ID for the cell
        currentRow.appendChild(cell);
    });

    container.appendChild(table);
}

// Function to fetch and populate data into the respective tables
function populateTableData() {
    tableData.forEach((table, index) => {
        if (table.files) {
            // Handle merged tables
            Promise.all(
                table.files.map(file =>
                    fetch(`${folderPath}${file}`).then(response => response.text())
                )
            )
                .then(csvTexts => {
                    const combinedData = csvTexts
                        .map(parseCSV)
                        .flat(); // Merge all CSV data

                    displayDataInCell(index, combinedData);

                    // 🚀 Send merged table data to the webhook
                    sendWebhookData({
                        tableName: table.name,
                        data: combinedData
                    });
                })
                .catch(error => {
                    console.error(`Error fetching data for ${table.name}:`, error);
                });
        } else {
            // Handle individual tables
            const filePath = `${folderPath}${table.file}`;
            fetch(filePath)
                .then(response => response.text())
                .then(csvText => {
                    const data = parseCSV(csvText);
                    displayDataInCell(index, data);

                    // 🚀 Send individual table data to the webhook
                    sendWebhookData({
                        tableName: table.name,
                        data: data
                    });
                })
                .catch(error => {
                    console.error(`Error fetching data for ${table.name}:`, error);
                });
        }
    });
}

// Function to send data to the webhook
function sendWebhookData(data) {
    fetch('http://localhost:3000/webhook', { // 🔹 Update this URL if hosted
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => console.log('Webhook Success:', responseData))
    .catch(error => console.error('Webhook Error:', error));
}

// Parse CSV text into an array of arrays
function parseCSV(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim() !== '');
    return rows.map(row => row.split(',').map(cell => cell.trim()));
}

// Display data for individual tables
function displayDataInCell(index, data) {
    const cell = document.getElementById(`table-${index}`);
    if (cell) {
        const table = document.createElement('table');
        table.classList.add('data-table');

        data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            row.forEach((cellData, cellIndex) => {
                const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
                cellElement.textContent = cellData;

                // Apply color coding for predictions
                if (rowIndex > 0 && cellIndex === 1) {
                    if (cellData.toLowerCase() === 'up') {
                        cellElement.style.color = 'green';
                    } else if (cellData.toLowerCase() === 'down') {
                        cellElement.style.color = 'red';
                    }
                }

                // Highlight cells containing the word "Nifty" and their corresponding prediction cell
                if (rowIndex > 0 && row[0].toLowerCase().includes('nifty')) {
                    if (cellIndex === 0 || cellIndex === 1) {
                        cellElement.style.backgroundColor = 'lightyellow';
                    }
                }

                tr.appendChild(cellElement);
            });

            // Add light yellow background to the header row
            if (rowIndex === 0) {
                tr.style.backgroundColor = 'lightyellow';
            }

            table.appendChild(tr);
        });

        cell.appendChild(table);
    }
}

// Initial render
renderTableLayout();
populateTableData();
