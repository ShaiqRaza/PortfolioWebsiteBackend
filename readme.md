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

**`Note:`** Cloudinary is a service providing cloud storage for images and videos. It is used in this project to store images and videos. For more information, visit [Cloudinary](https://cloudinary.com/).

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
    - Body: 
        ```json
        {
            "title": "Skill Title",
            "description": "Skill Description"
        }
        ```
- **POST /skill/:document_id**: Update a skill
    - Body: 
        ```json
        {
            "title": "Updated Skill Title",
            "description": "Updated Skill Description"
        }
        ```
- **POST /skill/:document_id**: Delete a skill

### About

- **GET /about/get**: Get about information
- **POST /about/create**: Create about information
    - Body: 
        ```json
        {
            "intro": "Intro Text",
            "description": "Description Text",
            "avatar": "Avatar Image File"
        }
        ```
- **POST /about/update-avatar**: Update avatar
    - Body: 
        ```json
        {
            "avatar": "New Avatar Image File"
        }
        ```
- **POST /about/update-intro**: Update intro
    - Body: 
        ```json
        {
            "intro": "Updated Intro Text"
        }
        ```
- **POST /about/update-description**: Update description
    - Body: 
        ```json
        {
            "description": "Updated Description Text"
        }
        ```
- **POST /about/remove-description**: Remove description

### Authentication

- **POST /auth/logout**: Logout admin
- **POST /auth/login**: Login admin
    - Body: 
        ```json
        {
            "email": "admin@example.com",
            "password": "adminpassword"
        }
        ```

### Admin

- **POST /admin/create**: Creates an admin, works only on development environment
    - Body: 
        ```json
        {
            "email": "admin@example.com",
            "password": "adminpassword"
        }
        ```
- **POST /admin/update**: Update admin (email, password)
    - Body: 
        ```json
        {
            "email": "newadmin@example.com",
            "password": "newadminpassword"
        }
        ```

### Projects

- **GET /project/get-all**: Get all projects
- **POST /project/create**: Create a new project
    - Body: 
        ```json
        {
            "title": "Project Title",
            "description": "Project Description"
        }
        ```
- **POST /project/add-image/:document_id**: Add an image to a specific project
    - Body: 
        ```json
        {
            "image": "Image File"
        }
        ```
- **POST /project/delete-image/:document_id**: Delete an image from a particular project
- **POST /project/add-video/:document_id**: Add a video to a specific project
    - Body: 
        ```json
        {
            "video": "Video File"
        }
        ```
- **POST /project/delete-video/:document_id**: Delete a video from a particular project
- **POST /project/delete/:document_id**: Delete project
- **POST /project/update-title/:document_id**: Update title of a project
    - Body: 
        ```json
        {
            "title": "Updated Project Title"
        }
        ```
- **POST /project/update-description/:document_id**: Update description of a project
    - Body: 
        ```json
        {
            "description": "Updated Project Description"
        }
        ```

### Documents

- **GET /doc/get-all**: Get all documents
- **POST /doc/create**: Create a new document
    - Body: 
        ```json
        {
            "title": "Document Title",
            "description": "Document Description",
            "image": "Document Image File"
        }
        ```
- **POST /docs/update-title/:id**: Update title of a particular document
    - Body: 
        ```json
        {
            "title": "Updated Document Title"
        }
        ```
- **POST /docs/update-image/:id**: Update image of a particular document
    - Body: 
        ```json
        {
            "image": "New Document Image File"
        }
        ```
- **POST /docs/update-description/:id**: Update description of a particular document
    - Body: 
        ```json
        {
            "description": "Updated Document Description"
        }
        ```
- **POST /docs/remove-description/:id**: Remove description of a specific document
- **POST /doc/delete/:id**: Delete a particular document

### Contact

- **POST /contact/send-email**: Submit a contact form which will be indirectly sent as an email
    - Body: 
        ```json
        {
            "name": "Your Name",
            "email": "your.email@example.com",
            "message": "Your message"
        }
        ```

## Contributing

Contributions are always welcome! Please create a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License.