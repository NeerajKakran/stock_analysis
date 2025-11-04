// Updated tableData mapping with merged columns
const tableData = [
    {
        name: "Combined Table", // Combines data from multiple sectors
        files: [
            "Nifty 50 Prediction 2025-11-04.csv",
            "Nifty Fin Services Prediction 2025-11-04.csv",
            "Nifty Infra Prediction 2025-11-04.csv",
        ],
    },
    { name: "Nifty IT", file: "Nifty IT Prediction 2025-11-04.csv" },
    { name: "Nifty Auto", file: "Nifty Auto Prediction 2025-11-04.csv" },
    { name: "Nifty FMCG", file: "Nifty FMCG Prediction 2025-11-04.csv" },
    { name: "Nifty Metal", file: "Nifty Metal Prediction 2025-11-04.csv" },
    { name: "Nifty Bank", file: "Nifty Bank Prediction 2025-11-04.csv" },
];

// Folder path for CSV files
const folderPath = './2025-11-04/';

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
    header.textContent = "Predictions for 04-November-25";
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
                })
                .catch(error => {
                    console.error(`Error fetching data for ${table.name}:`, error);
                });
        }
    });
}

// Parse CSV text into an array of arrays
function parseCSV(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim() !== '');
    return rows.map(row => row.split(',').map(cell => cell.trim()));
}

function displayDataInCell(index, data) {
    const cell = document.getElementById(`table-${index}`);
    if (!cell) return;

    cell.innerHTML = ''; // Clear previous content

    const table = document.createElement('table');
    table.classList.add('data-table');

    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        row.forEach((cellData, cellIndex) => {
            // We expect 4 columns now
            const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
            cellElement.textContent = cellData;

            // Color coding for Prediction column (index 1)
            if (rowIndex > 0 && cellIndex === 1) {
                const trend = cellData.toLowerCase();
                if (trend === 'up') {
                    cellElement.style.color = 'green';
                } else if (trend === 'down') {
                    cellElement.style.color = 'red';
                }
            }

            // Highlight rows with 'nifty' in Symbol column (index 0)
            if (rowIndex > 0 && row[0].toLowerCase().includes('nifty')) {
                if (cellIndex >= 0 && cellIndex <= 3) {
                    cellElement.style.backgroundColor = 'lightyellow';
                }
            }

            // Right-align numeric columns (Price LR and Price SARIMA - indexes 2 and 3)
            if (rowIndex > 0 && (cellIndex === 2 || cellIndex === 3)) {
                cellElement.style.textAlign = 'right';
            }

            // Align Symbol column (index 0) to left
            if (cellIndex === 0) {
                cellElement.style.textAlign = 'left';
            }

            tr.appendChild(cellElement);
        });

        // Header background
        if (rowIndex === 0) {
            tr.style.backgroundColor = 'lightyellow';
        }

        table.appendChild(tr);
    });

    cell.appendChild(table);
}


// Initial render
renderTableLayout();
populateTableData();



























































