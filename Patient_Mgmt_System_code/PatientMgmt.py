from flask import Flask, render_template, request, jsonify, session, redirect
from curd_operations import PatientDB
import os

app = Flask(__name__)

# Generate a secret key
app.secret_key = os.urandom(24)
# Create an instance of the PatientDB class
patient_db = PatientDB()

# Routes
@app.route('/')
def index():
    return render_template('login.html')

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = patient_db.authenticate_user(username, password)
        if user:
            session['username'] = username
            session['user_admin'] = user['User_Admin']
            if user['User_Admin'] == 'Admin':
                return redirect('/admin_dashboard')
            else:
                return redirect('/user_dashboard')
        else:
            return "Invalid username or password"
    return render_template('login.html')

# Admin dashboard route
@app.route('/admin_dashboard')
def admin_dashboard():
    if 'username' in session and session['user_admin'] == 'Admin':
        return render_template('admin_dashboard.html')
    else:
        return redirect('/login')

# User dashboard route
@app.route('/user_dashboard')
def user_dashboard():
    if 'username' in session and session['user_admin'] != 'Admin':
        username = session['username']
        user_data = patient_db.get_user_data(username)
        return render_template('user_dashboard.html', user_data=user_data)
    else:
        return redirect('/login')
    
@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    if 'username' in session:
        username = session['username']
        user_data = patient_db.get_user_data(username)
        if user_data:
            #print("User Data:", user_data)  
            return jsonify(user_data)
        else:
            return jsonify({'error': 'User data not found'}), 404
    else:
        return jsonify({'error': 'User not logged in'}), 401
    

# Edit user route
@app.route('/edit', methods=['POST'])
def edit_user_route():
    data = request.json
    patient_db.edit_user(data)
    return jsonify({'status': 'success', 'message': 'User details updated successfully'})


@app.route('/get_patients', methods=['GET'])
def get_patients_route():
    patients = patient_db.get_patients()
    return jsonify(patients)

@app.route('/get_patient/<patientID>', methods=['GET'])
def get_patient_route(patientID):
    patient = patient_db.get_patient(patientID)
    return jsonify(patient)

@app.route('/add_patient', methods=['POST'])
def add_patient_route():
    data = request.form
    patient_db.add_patient(data)
    return jsonify({'message': 'Patient added successfully'})

@app.route('/update_patient', methods=['POST'])
def update_patient_route():
    data = request.form
    patient_db.update_patient(data)
    return jsonify({'message': 'Patient updated successfully'})

@app.route('/delete_patient/<patientID>', methods=['DELETE'])
def delete_patient_route(patientID):
    patient_db.delete_patient(patientID)
    return jsonify({'message': f'Patient with ID {patientID} deleted successfully'})



if __name__ == '__main__':
     app.run(debug='True',host='192.168.113.3', port=5001, ssl_context=('cert.pem', 'key.pem'))
