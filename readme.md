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

- **GET /skill/get-all**: Get all skills
- **POST /skill/create**: Create a new skill
- **PUT /skill/:document id**: Update a skill
- **DELETE /skill/:document id**: Delete a skill

### About

- **GET /about/get**: Get about information
- **POST /about/create**: Create about information
- **POST /about/update-avatar**: Update avatar
- **POST /about/update-intro**: Update intro
- **POST /about/update-description**: Update description
- **POST /about/remove-description**: Remove description

### Authentication

- **POST /auth/logout**: Logout admin
- **POST /auth/login**: Login admin

### Admin

- **POST /admin/create**: creates an admin, works only on development environment
- **POST /admin/update**: Update admin( email, password)

### Projects

- **GET /project/get-all**: Get all projects
- **POST /project/create**: Create a new project
- **POST /project/add-image/:document id**: Add an image at a specific project
- **POST /project/delete-image/:document id**: Delete an image from a particular project
- **POST /project/add-video/:document id**: Add a video to a specific project
- **POST /project/delete-video/:document id**: Delete a video from a particular project
- **POST /project/delete/:document id**: Delete project
- **POST /project/update-title/:document id**: Update title of a project
- **POST /project/update-description/:document id**: Update description of a project

### Documents

- **GET /doc/get-all**: Get all documents
- **POST /doc/create**: Create a new document
- **POST /docs/update-title/:id**: Update title of a particular document
- **POST /docs/update-image/:id**: Update image of a particular document
- **POST /docs/update-description/:id**: Update image of a particular document
- **POST /docs/remove-description/:id**: Remove description of a specific document
- **POST /doc/delete/:id**: Delete a particular document

### Contact

- **POST /contact/send-email**: Submit a contact form which will be indirectly send as an email

## Contributing

Contributions are always welcome! Please create a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License.