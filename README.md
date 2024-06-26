# Welcome to the Movie Database Query Project!

This project is a web application for querying the database from The Movie DB through their API. It utilizes **React.js** for the frontend, and **Laravel** along with **MySQL** for authentication on the backend. The implementation of sorting according to certain criteria and the list of favorites according to each user will be added soon.

---

## Project Setup

To run the project, you'll need the following:

- **PHP**: For example, version 8.3.1 nts.
- **Composer**: For example, version 2.6.5.
- **Node.js**: For example, version 18.12.1.
- **npm**: For example, version 9.8.0.
- **Laragon**: Or something similar for the backend; for example, version 6.0.
- Replace the 2 `.env` files with the data from `.env.example` (both from the backend and from the frontend); ensure that the localhost ports are free.
- Start Apache and MySQL.

- Run the following commands in the backend folder:
    ```composer install```
    ```php artisan migrate```
    ```php artisan serve```

- Run the following commands in the frontend folder:
    ```npm install```
    ```npm start```


---

## Current Functionalities

- **Home Page**: Lists popular movies, with additional loading on scroll down.
- **Register Page**: Allows creation of a new account.
- **Login Page**: Enables logging in to an existing account.
- **Forgot Password Page**: Allows password recovery.
- **NavigationBar**: Enables searching for a movie.
- **NavigationBar -> Genres**: Fetches movies from a specific genre.
- **Modal for Movie Details**: Opening a movie card displays a modal (queried from TheMovieDB) showing detailed information about the respective movie.
- **Fully Responsive**: The interface is fully responsive.

---
