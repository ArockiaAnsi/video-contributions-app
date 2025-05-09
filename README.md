## Video Contributions app
A simple functional web application that allows users to view and search through a list of video contributions.

## Project Overview
A React frontend (/ui) for browsing and searching contributions

A FastAPI backend (/server) serving contributions data

Basic tests for the frontend components

CORS enabled on the backend to allow frontend-backend communication during development

## **Setup Instructions**
### Backend Setup
Please read the servers [README](./server/README.md) file for installation and running instructions. This server provides an API endpoint which you can use to retrieve Contributions.

### Frontend Setup 
- cd ui
- npm install
- npm start

## Running Tests
- npm test

## Code Quality
- npm run lint
- npm run format (To run Prettier)
