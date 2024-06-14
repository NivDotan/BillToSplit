document.addEventListener('DOMContentLoaded', () => {
    const proceedButton = document.getElementById('proceedButton');
    const addContactButton = document.getElementById('addContactButton');
    const contactsList = document.getElementById('contactsList');

    // Function to create a new contact select box
    const createContactSelectBox = () => {
        const container = document.createElement('div');
        container.className = 'contact-container';
        
        const select = document.createElement('select');
        select.className = 'contact-select';
        select.innerHTML = `
            <option value="">Select contact</option>
            <option value="John Doe">John Doe - 123456789</option>
            <option value="Jane Smith">Jane Smith - 987654321</option>
            <option value="Alice Johnson">Alice Johnson - 456123789</option>
            <!-- Add more contacts as needed -->
        `;

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '+';
        button.addEventListener('click', () => {
            contactsList.appendChild(createContactSelectBox());
        });

        container.appendChild(select);
        container.appendChild(button);

        return container;
    };

    // Initial contact select box
    addContactButton.addEventListener('click', () => {
        contactsList.appendChild(createContactSelectBox());
    });

    // Function to collect selected contacts
    const getSelectedContacts = () => {
        const selectedContacts = [];
        document.querySelectorAll('.contact-select').forEach(select => {
            if (select.value) {
                selectedContacts.push(select.value);
            }
        });
        return selectedContacts;
    };

    // Proceed button click handler
    proceedButton.addEventListener('click', () => {
        const selectedContacts = getSelectedContacts();
        console.log('Selected contacts:', selectedContacts);
        // Optionally, store the selected contacts for use in the next page
        localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
        window.location.href = '/table-view';
    });
});
