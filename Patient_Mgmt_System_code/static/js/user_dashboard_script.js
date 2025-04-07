document.addEventListener('DOMContentLoaded', function () {
    // Fetch user data and populate the table
    fetchUserData();

    // Attach event listener to the edit buttons
    const tableBody = document.getElementById('user-details-table').getElementsByTagName('tbody')[0];
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            const patientID = event.target.getAttribute('data-id');
            openEditModal(patientID);
        }
    });
});

// Function to fetch user data and populate the table
function fetchUserData() {
    // Perform a fetch request to get user data
    fetch('/get_user_data')
        .then(response => response.json())
        .then(user_data => {
            // Get the table body element
            const tableBody = document.getElementById('user-details-table').getElementsByTagName('tbody')[0];

            // Create a new row for the user data
            const newRow = document.createElement('tr');

            // Populate the row with user data
            newRow.innerHTML = `
                <td>${user_data.PatientID}</td>
                <td>${user_data.FirstName}</td>
                <td>${user_data.LastName}</td>
                <td>${user_data.SSN}</td>
                <td>${user_data.Diagnostics}</td>
                <td>${user_data.Birthdate}</td>
                <td>${user_data.Gender}</td>
                <td>${user_data.Address}</td>
                <td>${user_data.PhoneNumber}</td>
                <td>${user_data.Email}</td>
                <td>${user_data.Username}</td>
                <td>${user_data.Password}</td>
                <td>${user_data.User_Admin}</td>
                <!-- Populate more fields as needed -->
                <td><button class="edit-btn" data-id="${user_data.PatientID}">Edit</button></td>
            `;

            // Append the new row to the table body
            tableBody.appendChild(newRow);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Open edit modal with patient data
function openEditModal(patientID) {
    // Fetch patient data by ID
    fetch(`/get_patient/${patientID}`)
        .then(response => response.json())
        .then(patient => {
            // Populate the edit form with patient data
            const editForm = document.getElementById('edit-patient-form');
            editForm.id.value = patient.PatientID;
            editForm.firstName.value = patient.FirstName;
            editForm.lastName.value = patient.LastName;
            editForm.ssn.value = patient.SSN;
            editForm.diagnostics.value = patient.Diagnostics;
            editForm.birthdate.value = patient.Birthdate;
            editForm.gender.value = patient.Gender;
            editForm.address.value = patient.Address;
            editForm.phoneNumber.value = patient.PhoneNumber;
            editForm.email.value = patient.Email;
            editForm.password.value = patient.Password;

            // Show the edit patient modal
            const modal = document.getElementById('edit-patient-modal');
            modal.style.display = 'block';

            // Close modal event
            const closeBtn = document.querySelector('.close');
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });

            // Handle form submission
            editForm.addEventListener('submit', function(event) {
                event.preventDefault();
                submitEditForm();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Close modal function
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close-btn')) {
        const modal = document.getElementById('edit-patient-modal');
        modal.style.display = 'none';
    }
});

// Submit edit form
function submitEditForm() {
    const editForm = document.getElementById('edit-patient-form');
    const formData = new FormData(editForm);

    fetch('/edit', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Display success message
        location.reload(); // Reload the page to reflect changes
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
