import mysql.connector
import json

class PatientDB:
    def __init__(self):
        with open('config.json') as f:
            mysql_config = json.load(f)
        
        self.db = mysql.connector.connect(
            host=mysql_config['MYSQL_HOST'],
            user=mysql_config['MYSQL_USER'],
            password=mysql_config['MYSQL_PASSWORD'],
            database=mysql_config['MYSQL_DB']
        )

    def authenticate_user(self, username, password):
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Patients WHERE Username = %s AND Password = %s", (username, password))
        user = cursor.fetchone()
        cursor.close()
        return user

    def get_user_data(self, username):
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Patients WHERE Username = %s", (username,))
        user_data = cursor.fetchone()
        cursor.close()
        return user_data
    
    def edit_user(self, data):
        user_id = data['id']
        cursor = self.db.cursor()  # Initialize a cursor
        cursor.execute("""
        UPDATE Patients SET 
        FirstName=%s, LastName=%s, SSN=%s, Diagnostics=%s, Birthdate=%s, Gender=%s,
        Address=%s, PhoneNumber=%s, Email=%s, Password=%s 
        WHERE PatientID=%s""",
        (data['firstName'], data['lastName'], data['ssn'], data['diagnostics'], data['birthdate'],
        data['gender'], data['address'], data['phoneNumber'], data['email'], data['password'], user_id))
        self.db.commit()
        cursor.close()  # Close the cursor after use

    def get_patients(self):
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Patients")
        patients = cursor.fetchall()
        cursor.close()
        return patients

    def get_patient(self, patientID):
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Patients WHERE PatientID = %s", (patientID,))
        patient = cursor.fetchone()
        cursor.close()
        return patient
    

    def add_patient(self, data):
        cursor = self.db.cursor()
        sql = """INSERT INTO Patients (FirstName, LastName, SSN, Diagnostics, Birthdate, Gender, Address, PhoneNumber, Email, Username, Password, User_Admin) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        val = (data['firstName'], data['lastName'], data['ssn'], data['diagnostics'], 
               data['birthdate'], data['gender'], data['address'], data['phoneNumber'], 
               data['email'], data['username'], data['password'], data['user_admin'])
        cursor.execute(sql, val)
        self.db.commit()
        cursor.close()

    def update_patient(self, data):
        cursor = self.db.cursor()
        sql = """UPDATE Patients 
                 SET FirstName=%s, LastName=%s, SSN=%s, Diagnostics=%s, Birthdate=%s, 
                     Gender=%s, Address=%s, PhoneNumber=%s, Email=%s, Username=%s, Password=%s, User_Admin=%s 
                 WHERE PatientID=%s"""
        val = (data['firstName'], data['lastName'], data['ssn'], data['diagnostics'], 
               data['birthdate'], data['gender'], data['address'], data['phoneNumber'], 
               data['email'], data['username'], data['password'], data['user_admin'], data['patientID'])
        cursor.execute(sql, val)
        self.db.commit()
        cursor.close()

    def delete_patient(self, patientID):
        cursor = self.db.cursor()
        sql = "DELETE FROM Patients WHERE PatientID = %s"
        val = (patientID,)
        cursor.execute(sql, val)
        self.db.commit()
        cursor.close()

    