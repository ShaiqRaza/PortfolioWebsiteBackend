# Portfolio Website Backend

This is a backend for a portfolio website, built with Node.js and Express.js. It provides APIs for managing skills, about section, authentication, projects, documents, and contact information.

## Features

- Admin auth
- Contact form
- Manage about section
- Manage skills
- Manage projects
- Manage documents

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `DB_URI`: MongoDB connection string deployed on any cloud platform like MongoDB Atlas
- `JWT_SECRET`: Secret key for JWT authentication
- `NODE_ENV`: Environment (development or production)
- `CLOUDINARY_CLOUD_NAME`: Can get this from cloudinary account
- `CLOUDINARY_API_KEY`: Can get this from cloudinary account
- `CLOUDINARY_SECRET`: Can get this from cloudinary account

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ShaiqRaza/PortfolioWebsiteBackend
    ```

2. Navigate to the project directory:
    ```bash
    cd PortfolioWebsiteBackend
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add the required environment variables.

5. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### Skills

- **GET /skills**: Get all skills
- **POST /skills**: Create a new skill
- **PUT /skills/:id**: Update a skill
- **DELETE /skills/:id**: Delete a skill

### About

- **GET /about**: Get about information
- **POST /about**: Create about information
- **PUT /about/avatar**: Update avatar
- **PUT /about/intro**: Update intro
- **PUT /about/description**: Update description

### Authentication

- **POST /auth/register**: Register a new user
- **POST /auth/login**: Login a user

### Admin

- **GET /admin/users**: Get all users (admin only)
- **DELETE /admin/users/:id**: Delete a user (admin only)

### Projects

- **GET /projects**: Get all projects
- **POST /projects**: Create a new project
- **PUT /projects/:id**: Update a project
- **DELETE /projects/:id**: Delete a project

### Documents

- **GET /docs**: Get all documents
- **POST /docs**: Create a new document
- **PUT /docs/:id**: Update a document
- **DELETE /docs/:id**: Delete a document

### Contact

- **POST /contact**: Submit a contact form

## Contributing

Contributions are always welcome! Please create a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License.