## Milestone 1: Setup Supabase Database

**Objective:** Create the necessary database tables and relationships in the Supabase project to store Grease the Groove application data.

**Technical Context:**

* This project uses Supabase as the backend database.
* The database should be designed to store user data, exercise information, and completed set logs.

**Requirements:**

1. **Create the following tables:**
   * **`Users` Table:**
      * `id` (UUID, Primary Key) - Unique identifier for each user.
      * `email` (TEXT, Unique) - User's email address.
      * `created_at` (TIMESTAMP) - Timestamp of user creation.
      * Add any other relevant user profile fields as needed (e.g., name).
   * **`Exercises` Table:**
      * `id` (UUID, Primary Key) - Unique identifier for each exercise.
      * `name` (TEXT) - Name of the exercise (e.g., "Pull-ups", "Push-ups").
      * `description` (TEXT) - Brief description of the exercise (optional).
      * Pre-populate this table with a list of common Grease the Groove exercises.
   * **`UserExercises` Table:**
      * `id` (UUID, Primary Key) - Unique identifier for the user-exercise relationship.
      * `user_id` (UUID, Foreign Key referencing `Users.id`) - User associated with the exercise.
      * `exercise_id` (UUID, Foreign Key referencing `Exercises.id`) - Exercise selected by the user.
      * `target_reps` (INTEGER) - Target number of reps per set for the exercise.
   * **`Sets` Table:**
      * `id` (UUID, Primary Key) - Unique identifier for each completed set.
      * `user_exercise_id` (UUID, Foreign Key referencing `UserExercises.id`) - The user's exercise this set belongs to.
      * `reps` (INTEGER) - Number of reps performed in this set.
      * `timestamp` (TIMESTAMP) - Timestamp of when the set was completed.

2. **Establish Relationships:**
   * Create foreign key relationships as specified above to link tables correctly.

**Instructions for LLM:**

* Generate the instructions to create these tables with the specified columns and data types.
* Ensure proper foreign key constraints are established.
* If you can interact with the Supabase project directly, apply these instructions to create the tables. 