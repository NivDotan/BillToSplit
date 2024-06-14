document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const saveButton = document.getElementById('saveButton');

    // Retrieve selected contacts from local storage
    const selectedContacts = JSON.parse(localStorage.getItem('selectedContacts')) || [];

    // Function to populate contacts in a select element
    const populateContacts = (select) => {
        select.innerHTML = `<option value="">Select person</option>`;
        selectedContacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = contact;
            option.textContent = contact;
            select.appendChild(option);
        });
    };

    // Populate contacts in the initial dropdowns
    document.querySelectorAll('.who-pay-select').forEach(select => {
        populateContacts(select);
    });

    // Add person button event handler
    document.querySelectorAll('.add-person-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const whoPayContainer = event.target.closest('.who-pay-container');
            const newSelect = whoPayContainer.querySelector('.who-pay-select').cloneNode(true);
            populateContacts(newSelect);
            whoPayContainer.insertBefore(newSelect, event.target);
        });
    });

    // Function to gather table data
    const gatherTableData = () => {
        const tableData = [];
        tableBody.querySelectorAll('tr').forEach(row => {
            const item = row.children[0].textContent;
            const price = parseFloat(row.children[1].textContent);
            const quantity = parseInt(row.children[2].textContent);
            const whoPaySelects = row.querySelectorAll('.who-pay-select');
            const whoPay = Array.from(whoPaySelects).map(select => select.value).filter(value => value);

            whoPay.forEach(person => {
                tableData.push({ person, item, price: price * quantity });
            });
        });
        return tableData;
    };

    // Save button event handler
    saveButton.addEventListener('click', () => {
        const tableData = gatherTableData();
        console.log('Table Data:', tableData);
        // Store table data in local storage for use in the final page
        localStorage.setItem('finalTableData', JSON.stringify(tableData));
        window.location.href = '/final-view';
    });
});
