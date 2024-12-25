# Milestone 11: Social Sharing Feature with Supabase Edge Functions

**Objective:** Implement a social sharing feature that allows users to share their daily streak as an image generated using Supabase Edge Functions, with the image stored in Supabase Storage.

**Technical Context:**

*   This milestone focuses on creating an automated process for generating shareable images with dynamic user data.
*   The core of this feature will utilize a Supabase Edge Function to generate images on the fly.
*   Generated images will be stored in a Supabase Storage bucket.
*   Users will receive a URL to share the generated image to social media.

**Requirements:**

1.  **Supabase Storage Setup:**
    *   **Create a New Bucket:** Create a dedicated Supabase Storage bucket (e.g., `shareable-images`) to store the generated images.
    *   **Configure Permissions:** Set up appropriate permissions for the bucket to allow read access to anyone with the URL and write access only for the edge functions.
    *   **Plan folder structure:** Plan a folder structure for easy access and organization of the images. Maybe a folder based on the userId and the current date.

2.  **Supabase Edge Function Development:**
    *   **Function Trigger:** Create a new Supabase Edge Function (e.g., `generate-share-image`).
    *   **Function Inputs:** This function should accept the following inputs:
        *   `userId`: The user ID requesting the share image.
        *   `streak`: The user's current streak count (integer).
    *   **Image Generation:**
        *   Utilize a library in the edge function to generate images dynamically (e.g., `canvas`, `sharp`, or similar).
        *   Implement logic to use pre-designed image templates.
        *   Populate the streak, the app branding, the user's daily percentage and any other additional text on the template.
        *    The generated images must be high-resolution and optimized for social media sharing
    *   **Image Upload to Storage:**
        *   Upload the generated image to the Supabase Storage bucket (the `shareable-images`).
        *   Name the image file with a unique identifier (e.g., `userId_timestamp.png`).
    *   **Response:**
        *   The edge function should return a JSON response with the URL to the uploaded image.
        *   Handle errors and return appropriate error codes and messages.
    *   **Security:** The edge function should ensure that no user can generate a share image from any other user.

3.  **App Integration:**
    *   **Triggering the Share:** When a user achieves their daily workout goal:
        *   Display a share button or prompt to share their progress.
    *   **Request to Edge Function:**
        *   Send a request to the `generate-share-image` edge function with the user's ID, streak, template and daily percentage.
    *   **Image URL Handling:**
        *   Receive the generated image URL from the edge function response.
        *   Display a share dialog that will use the generated image URL.
    *   **Social Sharing Implementation:**
         * Implement the specific implementation to share on:
             * Instagram
             * X
             * Facebook
        * Add share buttons for the specific social networks
    *    **Error Handling:** Handle errors (e.g., network issues, edge function errors) and display informative error messages to the user.

4.  **UI/UX Considerations:**
    *   **Share Dialog:**
        *   Design a simple and intuitive share dialog.
        *   Include options for selecting the share image template.
        *   Include sharing buttons for the supported social networks.
    *   **Progress Feedback:**
        *   Display a confirmation message after the image is shared.
    *    **User Flow:** Guide the user through the sharing process, minimizing friction.
    *   **Error Handling:** When generating the image or sharing it, show a modal to explain to the user what happen.

**Programming Requirements (Detailed):**

1.  **Supabase Storage:**
    *   Utilize the Supabase JavaScript client library to:
        *   Create and configure the `shareable-images` bucket.
        *   Upload images to the bucket from the edge function.

2.  **Edge Function Implementation:**
    *   **Environment Setup:** Configure the necessary environment variables for the edge function (e.g., Supabase API URL, Storage bucket URL, etc.).
    *   **Image Template Logic:**
        *   Implement logic to load and apply different image templates based on the input.
        *   Ensure that text, images and any other relevant information is correctly placed on the template.
    *   **Supabase Client:** Use the Supabase client to store the image and generate the unique id of the image.
    *   **Error Handling:** Implement try-catch blocks to handle errors and return appropriate error responses.
    *   **Response:** Structure the response correctly with the image URL or error messages.

3.  **App Integration:**
    *   **API Call:** Send a POST request to the edge function with the required data.
    *   **JSON Parsing:** Parse the JSON response to retrieve the image URL.
    *   **Image Sharing Component:** Implement specific code to share to the different social networks.
    *   **UI Updates:** Update the app's UI to show the share dialog, share button, and provide feedback to the user.
    *    **Permissions:** Implement the necessary permissions for the social networks.

**Deliverables:**

*   Configured Supabase Storage bucket for shareable images.
*   Fully functional `generate-share-image` Supabase Edge Function.
*   Integrated sharing functionality within the mobile app, including UI and social sharing implementation.
*   Thoroughly tested and documented code for all components.