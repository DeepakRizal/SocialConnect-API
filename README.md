
# SocialMedia API

Welcome to the SocialLink API repository! This API provides endpoints for a basic social media platform, allowing users to follow, unfollow, like, and update their posts. It's designed to be simple to integrate and use.

## Endpoints

### User Authentication

- `POST /api/auth/register`
  - Register a new user.
  - Request Body:
    ```json
    {
      "username": "JohnDoe",
      "email": "johndoe@example.com",
      "password": "",
      "passwordConfirm": ""
    }
    ```

- `POST /api/auth/login`
  - User login.

### User Actions

- `PUT /api/users/:userId`
  - Update user profile.
  - Request Body:
    ```json
    {
        "userId": "userId",
        "desc": "This is the updated description"
    }
    ```

- `DELETE /api/users/:userId`
  - Delete user.

- `GET /api/users/:userId`
  - Get user details.

- `POST /api/users/:userId/follow`
  - Follow a user.
  - Request Body:
    ```json
    {
        "userId": "Your user id"
    }
    ```

- `POST /api/users/:userId/unfollow`
  - Unfollow a user.

### Post Actions

- `PUT /api/posts/:postId`
  - Update a post.
  - Request Body:
    ```json
    {
        "userId": "The Id of The user updating the post",
        "desc": "I have updated my post"
    }
    ```

- `POST /api/posts`
  - Create a new post.
  - Request Body:
    ```json
    {
         "userId": "Id of the user updating the post",
         "desc": "Description",
         "img": "image.jpg"
    }
    ```

- `DELETE /api/posts/:postId`
  - Delete a post.
  - Request Body:
    ```json
    {
        "userId": "Id of the user deleting the post"
    }
    ```

- `POST /api/posts/:postId/like`
  - Like or dislike a post.
  - Request Body:
    ```json
    {
        "userId": "Id of the user liking/disliking"
    }
    ```

- `GET /api/posts/:postId`
  - Get a post.

- `GET /api/posts/timeline/all`
  - Get all posts for a user.
  - Request Body:
    ```json
    {
        "userId": "Id"
    }
    ```

Feel free to clone this repository and integrate the SocialLink API into your application.
