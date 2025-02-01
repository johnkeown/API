# API Project

## Overview

This project is an API that provides various functionalities and endpoints for different operations.

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/johnkeown/API.git
    ```
2. Navigate to the project directory:
    ```
    cd API
    ```
3. Install the dependencies:
    ```
    npm install
    ```

## Usage

1. Start the server:
    ```
    npm run start:dev
    ```
2. Access the API at `http://localhost:8000`.

## Docker Usage

1. Build the image:
    ```
    docker build -t api .
    ```
2. Create the container, setting the volume:
    ```
    docker run -v $(pwd):/app -p 127.0.0.1:8000:8000 -it api
    ```
3. Run the container:
    ```
    docker start -ai api
    ```
4. Access the API at `http://localhost:8000`.
