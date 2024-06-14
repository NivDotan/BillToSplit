document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const saveButton = document.getElementById('saveButton');

    // Add person button event handler
    document.querySelectorAll('.add-person-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const whoPayContainer = event.target.closest('.who-pay-container');
            const newSelect = whoPayContainer.querySelector('.who-pay-select').cloneNode(true);
            whoPayContainer.insertBefore(newSelect, event.target);
        });
    });

    // Function to gather table data
    const gatherTableData = () => {
        const tableData = [];
        tableBody.querySelectorAll('tr').forEach(row => {
            const item = row.children[0].textContent;
            const price = row.children[1].textContent;
            const quantity = row.children[2].textContent;
            const whoPaySelects = row.querySelectorAll('.who-pay-select');
            const whoPay = Array.from(whoPaySelects).map(select => select.value).filter(value => value);
            tableData.push({ item, price, quantity, whoPay });
        });
        return tableData;
    };

    // Save button event handler
    saveButton.addEventListener('click', () => {
        const tableData = gatherTableData();
        console.log('Table Data:', tableData);
        // Perform save operation, e.g., send data to the server
    });
});
