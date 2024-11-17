**--- `milestones/04_home_screen.md` ---**

## Milestone 4: Home Screen

**Objective:**  Create the main screen that displays the user's chosen exercises for the day.

**Technical Context:**

* This screen should fetch the exercises selected by the user from the `UserExercises` table.
* It should provide a clear overview of the daily GtG routine.

**Requirements:**

1. **Create a new screen component (`HomeScreen.tsx`).**
2. **Fetch the user's selected exercises from the `UserExercises` table on component mount.**
   * Use the Supabase client to query based on the logged-in user's ID.
   * Join the `Exercises` table to get exercise names and descriptions.
3. **Display each selected exercise as a card or list item.**
   * Show the exercise name and target reps.
4. **Include a "Log Set" button for each exercise.**
   * This button should trigger the set logging functionality (implemented in the next milestone).
5. **(Optional) Add a visual indicator (e.g., checkmark) if all sets have been completed for an exercise for the day.**

**Instructions for LLM:**

* Generate the code for `HomeScreen.tsx`.
* Use `@supabase/supabase-js` to fetch user-specific exercise data.
* Design a clear and visually appealing UI to display exercises.
* The "Log Set" button can initially be a placeholder, but should be clearly identifiable.