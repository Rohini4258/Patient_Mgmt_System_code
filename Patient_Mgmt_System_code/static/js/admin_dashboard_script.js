document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitPatient');

    submitButton.addEventListener('click', function () {
        const formData = new FormData(document.getElementById('patientForm'));

        fetch('/add_patient', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            $('#addPatientModal').modal('hide'); 
            loadPatients(); // Refresh patient data after adding new patient
            document.getElementById('patientForm').reset(); // Reset the form fields
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Function to load patients
    function loadPatients() {
        fetch('/get_patients')
            .then(response => response.json())
            .then(data => {
                const patientsBody = document.getElementById('patients-body');
                patientsBody.innerHTML = '';
                data.forEach(patient => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${patient.PatientID}</td>
                        <td>${patient.FirstName}</td>
                        <td>${patient.LastName}</td>
                        <td>${patient.SSN}</td>
                        <td>${patient.Diagnostics}</td>
                        <td>${patient.Birthdate}</td>
                        <td>${patient.Gender}</td>
                        <td>${patient.Address}</td>
                        <td>${patient.PhoneNumber}</td>
                        <td>${patient.Email}</td>
                        <td>${patient.Username}</td>
                        <td>${patient.Password}</td>
                        <td>${patient.User_Admin}</td>
                        <td>
                            <button class="edit-btn btn btn-primary" data-patientid="${patient.PatientID}" data-toggle="modal" data-target="#editPatientModal">Edit</button>
                            <button class="delete-btn btn btn-danger" data-patientid="${patient.PatientID}">Delete</button>
                        </td>
                    `;
                    patientsBody.appendChild(row);
                });

                //event listeners for edit buttons
                const editButtons = document.querySelectorAll('.edit-btn');
                editButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const patientID = this.getAttribute('data-patientid');
                        fetch(`/get_patient/${patientID}`)
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('editPatientID').value = data.PatientID;
                                document.getElementById('editFirstName').value = data.FirstName;
                                document.getElementById('editLastName').value = data.LastName;
                                document.getElementById('editSSN').value = data.SSN;
                                document.getElementById('editDiagnostics').value = data.Diagnostics;
                                document.getElementById('editBirthdate').value = data.Birthdate;
                                document.getElementById('editGender').value = data.Gender;
                                document.getElementById('editAddress').value = data.Address;
                                document.getElementById('editPhoneNumber').value = data.PhoneNumber;
                                document.getElementById('editEmail').value = data.Email;
                                document.getElementById('editUsername').value = data.Username;
                                document.getElementById('editPassword').value = data.Password;
                                document.getElementById('editUser_Admin').value = data.User_Admin;
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    });
                });

                // event listeners for delete buttons
                const deleteButtons = document.querySelectorAll('.delete-btn');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const patientID = this.getAttribute('data-patientid');
                        const confirmDelete = confirm(`Are you sure you want to delete patient with ID ${patientID}?`);
                        if (confirmDelete) {
                            fetch(`/delete_patient/${patientID}`, {
                                method: 'DELETE'
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data.message);
                                // Refresh patient data after deletion
                                loadPatients();
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                        }
                    });
                });
            });
    }

    // Load patients when the page is loaded
    loadPatients();

    // Event listener for submit button in edit modal
    const submitEditButton = document.getElementById('submitEditPatient');
    submitEditButton.addEventListener('click', function () {
        // Prevent default form submission
        event.preventDefault();

        // Collect updated patient data
        const formData = new FormData(document.getElementById('editPatientForm'));

        // Send updated data to server
        fetch('/update_patient', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            $('#editPatientModal').modal('hide'); 
            // Refresh patient data after update
            loadPatients();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});