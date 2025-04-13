# CSE108MiniProject
CSE108 Mini Project 
use the pip install -r backend/requirements.txt command to be able to install the required libraries
in case you install more:
pip freeze > backend/requirements.txt

# Current features, student enrollment add drop courses with page, mycourses page for student,  admin panel to create courses, users, register/login,
# models, user role based, course for classes with capacity,  studen_courses which holds student and what class they are enrolled to show in their "myclasses page"


-  **Flask (Python)** for backend API
-  **React** for frontend interface
-  **SQLite** for datasbse storage
-   Role-based UI pages (Teacher, Student, Admin)

## Project Structure


### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # windows
pip install -r requirements.txt
python run.py

```
### 2. Frontend (setup react)

```bash 
cd frontend
npm install
npm start

#check package.json for proxy
 #   "name": "frontend",
  #  "version": "0.1.0",
  #  "private": true,
  #  "proxy": "http://localhost:5000",


API endpoints
so far from lab 6
Method	 Endpoint	            Description
GET	     /api/grades	        Get all grades
POST	 /api/grades	        Add a new grade
PUT    	 /api/grades/<name>	    Update a grade
DELETE	 /api/grades/<name>	    Delete a grade
GET	     /api/grades/<name>	    Get a specific grade
```
# To run the app
make two terminals
one in backend 
then run
python run.py

then on the other terminal
\frontend

npm start

so far there is no protected routes, I just added what we had for lab 6 we can later add/integrate and clean up the rest
basic pages
