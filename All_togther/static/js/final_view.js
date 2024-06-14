document.addEventListener('DOMContentLoaded', () => {
    const finalTableBody = document.getElementById('finalTableBody');

    // Retrieve final table data from local storage
    const finalTableData = JSON.parse(localStorage.getItem('finalTableData')) || [];

    // Function to create a row in the final table
    const createTableRow = (data) => {
        const row = document.createElement('tr');
        
        const contactCell = document.createElement('td');
        contactCell.textContent = data.person;
        row.appendChild(contactCell);
        
        const itemsCell = document.createElement('td');
        itemsCell.textContent = data.items;
        row.appendChild(itemsCell);
        
        const amountCell = document.createElement('td');
        amountCell.textContent = `$${data.totalAmount.toFixed(2)}`;
        row.appendChild(amountCell);
        
        const actionCell = document.createElement('td');
        const bitButton = document.createElement('button');
        bitButton.textContent = 'Bit';
        bitButton.addEventListener('click', () => {
            alert(`Bit sent to ${data.person} for $${data.totalAmount.toFixed(2)}!`);
        });
        actionCell.appendChild(bitButton);
        row.appendChild(actionCell);
        
        return row;
    };

    // Populate the final table with data
    finalTableData.forEach(data => {
        const row = createTableRow(data);
        finalTableBody.appendChild(row);
    });
});
