## Milestone 5: Set Logging Functionality

**Objective:** Implement the logic to log completed sets for each exercise.

**Technical Context:**

* This functionality should be triggered by the "Log Set" button on the `HomeScreen`.
* Completed set data should be stored in the `Sets` table in Supabase.

**Requirements:**

1. **Update the "Log Set" button in `HomeScreen.tsx` to trigger a function for set logging.**
2. **Implement a function that:**
   * Determines the relevant `UserExercise` ID based on which exercise's button was clicked.
   * Inserts a new record into the `Sets` table with:
      * `user_exercise_id`: The ID of the exercise.
      * `reps`: A default or fixed number of reps (this can be adjusted later based on user input).
      * `timestamp`: The current timestamp.
3. **Provide feedback to the user after logging a set.**
   * A simple confirmation message or visual cue is sufficient.

**Instructions for LLM:**

Implement the set logging function using @supabase/supabase-js to insert data into the Sets table.

Ensure proper error handling in case of database issues.

Provide clear user feedback after a set is logged.