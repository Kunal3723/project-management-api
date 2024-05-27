# Project Management API

## How to Start

1. **Start PostgreSQL Server**
   - Ensure you have PostgreSQL server running on your machine.
   - Alternatively, update your `.env` file with remote server credentials.

2. **Create .env File**
   - Create a `.env` file in the root directory of your project.
   - Add the following configuration details to the `.env` file: (I know it's not recommended to share credentials but it will save tester's valuable time)

     ```plaintext
     DB_USERNAME=postgres
     DB_PASSWORD=123456
     DB_NAME=postgres
     DB_HOST=localhost

     JWT_SECRET=c0a8b7a9a0d8b5e6c9d7e6f8e7f6e5f4e3f2f1f0f1f2f3f4f5f6f7f8f9fabcdefedcba

     GOOGLE_CLIENT_ID=44481051348-2106l8gchabv7kim180lp4fa3scb82sv.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=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

     LINKEDIN_CLIENT_ID=78f59wm81y5dbh
     LINKEDIN_CLIENT_SECRET=WPL_AP0.mlTUScWe2OeBzo04.NDgwNTc0ODY4

     PORT=3000

     REDIS_PORT=26911
     REDIS_PASSWORD=AVNS_60F23DRcodnrbSyeQ_i
     REDIS_HOST=redis-3ef71560-dtom7628-12a0.a.aivencloud.com

     GMAIL_USER=dtom7628@gmail.com
     GMAIL_PASSWORD=nzlq ezwe tbtz zwbw
     ```

3. **Install Dependencies**
   - Run the following command in your terminal to install necessary packages:

     ```bash
     npm install
     ```

4. **Start the Application**
   - Run the following command in your terminal to start the server:

     ```bash
     npm start
     ```

5. **Test the Endpoints**
   - Open Thunder Client in your VS Code.
   - Import `thunder-collection_proj.json` from the root directory.
   - Use Thunder Client to test all endpoints.

## Additional Information

- Make sure to replace sensitive data such as passwords and secrets with your own secure values.
- Ensure your PostgreSQL server and Redis server configurations match those in your `.env` file.
- You can use the provided `thunder-collection_proj.json` file to quickly test and verify the API endpoints are working as expected.
