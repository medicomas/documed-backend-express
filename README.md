# documed

### Stack 

- javascript
- node js
- express js

### Requirements

- Node.js and npm: You can download them from [nodejs.org](https://nodejs.org/).

## Installation

Follow these steps to set up and run the application:

1. Clone the repository:

   git clone https://github.com/medicomas/documed-backend-express.git

2. Install the dependencies:

    npm install

3. Configure environment variables (if necessary).

4. Start the application:
    
    npm start

5. For development work, use hot reolad with: 

    npm run dev

The application will run on http://localhost:3000 by default. You can change the port in the src/app.js file or via the PORT environment variable.

### Scripts

| Script      | Description                                |
| ----------- | ------------------------------------------ |
| npm start   | Runs the application.                      |
| npm dev     | Runs the app dev server with auto-restart  |
| npm test    | Run tests                                  |


### Collaboration Rules

Following [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/): 

- Format would be (type-of-change)[scope]: (description). 
Types would be feat, fix, build, ci, docs, style, refactor, test, etc.

e.g. :
feat(backend-template): initial project structure and setup

#### Made with <3 by UNMSM
