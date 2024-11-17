**--- `milestones/03_exercise_selection_screen.md` ---**

## Milestone 3: Exercise Selection Screen

**Objective:**  Create a screen where users can select their Grease the Groove exercises and set target reps for each.

**Technical Context:**

* This screen should fetch the available exercises from the `Exercises` table in Supabase.
* User selections and target reps should be saved in the `UserExercises` table.

**Requirements:**

1. **Create a new screen component (`ExerciseSelectionScreen.tsx``).**
2. **Fetch the list of exercises from the `Exercises` table in Supabase on component mount.**
   * Use the Supabase client to retrieve all exercises.
3. **Display the exercises in a list or grid format.**
   * Allow users to select 1-3 exercises (or implement a configurable limit).
4. **For each selected exercise, allow users to input their target reps per set.**
5. **Implement a "Save" or "Confirm" button.**
   * On button press, save the selected exercises and target reps to the `UserExercises` table in Supabase.
   * Use the currently logged-in user's ID (from Supabase Auth).

**Instructions for LLM:**

* Generate the code for `ExerciseSelectionScreen.tsx`.
* Use `@supabase/supabase-js` to fetch exercises and save user selections.
* Design a clean and user-friendly UI for exercise selection and rep input.