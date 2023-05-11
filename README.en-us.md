# Image Converter

This project is a web application that allows users to upload images and convert them to a different format. The project uses Azure to host all infrastructure, including a frontend web app, an Azure Function to convert images using Jimp, and a Terraform folder containing all the infrastructure as code (IaC).

## Architecture

The architecture of the application consists of three main components:

1. Frontend Web App - The frontend is built using React, TypeScript, and Vite. It provides a user interface for uploading images and selecting the desired output format.

2. Azure Function - The Azure Function is an HTTP trigger that converts images using the Jimp library. It is responsible for receiving the uploaded image, processing it, and returning the converted image to the user.

3. Terraform - The Terraform folder contains all the infrastructure as code. It defines the Azure resources required for the application, including the storage account for storing uploaded images, the function app for hosting the Azure Function, and the necessary networking components.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository to your local machine.
2. Install Terraform and set up your Azure credentials.
3. Navigate to the `terraform` folder and run `terraform init` to initialize the project.
4. Run `terraform apply` to create the necessary Azure resources.
5. Navigate to the `frontend` folder and run `npm install` to install the dependencies.
6. Run `npm start` to start the frontend web app.
7. Upload an image and select the desired output format to convert the image.

## Contributing

Contributions to the project are welcome. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them to your branch.
4. Push your changes to your fork.
5. Create a pull request to merge your changes into the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.