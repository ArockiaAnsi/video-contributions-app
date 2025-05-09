## Video Contributions app

## Overview
A simple yet functional web application that allows users to view and search through a list of video contributions.

## **Setup Instructions**
### Backend Setup
Please read the servers [README](./server/README.md) file for installation and running instructions. This server provides an API endpoint which you can use to retrieve Contributions.

- cd server  
- python3 -m venv venv
- source venv/bin/activate  
- pip install -r requirements.txt 
- uvicorn main:app --reload

### Frontend Setup 
- cd ui
- npm install
- npm start

## To check the test
- npm test


## Note
To enable communication between the React frontend (localhost:3000) and FastAPI backend (localhost:8000), CORS (Cross-Origin Resource Sharing) middleware is added to the backend.

This is required because browsers block requests to a different domain/port unless the server explicitly allows it.