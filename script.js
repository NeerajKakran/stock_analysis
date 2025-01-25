// Table names and corresponding CSV files
const tableData = [
    { name: "", file: "Nifty 50 Prediction 2025-01-24.csv" },
    { name: "", file: "Nifty IT Prediction 2025-01-24.csv" },
    { name: "", file: "Nifty Auto Prediction 2025-01-24.csv" },
    { name: "", file: "Nifty Fin Services Prediction 2025-01-24.csv" },
    { name: "", file: "Nifty FMCG Prediction 2025-01-24.csv" },
    { name: "", file: "Nifty Metal Prediction 2025-01-24.csv" },
    { name: "", file: "Nifty Bank Prediction 2025-01-24.csv" },
    { name: "", file: "Nifty Infra Prediction 2025-01-24.csv" }
];

// Folder path for CSV files
const folderPath = './2025-01-24/';

// Function to render the table layout
function renderTableLayout() {
    const container = document.getElementById('tableContainer');
    container.innerHTML = ''; // Clear the container

    const table = document.createElement('table');
    table.classList.add('main-table');

    // Add table header
    const headerRow = document.createElement('tr');
    const header = document.createElement('th');
    header.setAttribute('colspan', 4); // Span across 4 columns
    header.textContent = "Predictions for 24-Jan-25";
    header.style.textAlign = "center";
    headerRow.appendChild(header);
    table.appendChild(headerRow);

    // Add rows and columns based on tableData
    for (let i = 0; i < tableData.length; i += 4) {
        const row = document.createElement('tr');

        for (let j = i; j < i + 4; j++) {
            const cell = document.createElement('td');
            if (j < tableData.length) {
                cell.textContent = tableData[j].name;
                cell.id = `table-${j}`; // Assign unique ID for dynamic data population
            }
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    container.appendChild(table);
}

// Function to fetch and populate data into the respective tables
function populateTableData() {
    tableData.forEach((table, index) => {
        const filePath = `${folderPath}${table.file}`;
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${table.file}`);
                }
                return response.text();
            })
            .then(csvText => {
                const data = parseCSV(csvText);
                displayDataInCell(index, data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

// Parse CSV text into an array of arrays
function parseCSV(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim() !== '');
    return rows.map(row => row.split(',').map(cell => cell.trim()));
}

// Display data in the corresponding cell
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
                if (rowIndex > 0 && cellIndex === 1) { // Assuming the prediction column is the second column
                    if (cellData.toLowerCase() === 'up') {
                        cellElement.style.color = 'green';
                    } else if (cellData.toLowerCase() === 'down') {
                        cellElement.style.color = 'red';
                    }
                }

                tr.appendChild(cellElement);
            });

            // Add light yellow background to the header row
            if (rowIndex === 1) {
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
