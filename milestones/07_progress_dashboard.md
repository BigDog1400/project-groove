## Milestone 7: Progress Dashboard

**Objective:** Create a screen to visualize the user's GtG progress.

**Technical Context:**

* This screen should fetch data from the `Sets` table to display progress metrics.

**Requirements:**

1. **Create a new screen component (`ProgressDashboardScreen.tsx`).**
2. **Fetch data from the `Sets` table for the logged-in user.**
3. **Calculate the following metrics:**
   * **Current Streak:**  Number of consecutive days with logged sets for all selected exercises.
   * **Completion Percentage (Daily):** Percentage of target sets completed for each exercise for the current day.
4. **Display the calculated metrics clearly on the screen.**
   * Use visual elements like progress bars or charts where appropriate.
5. **(Optional) Implement a calendar view to show completed days.**

**Instructions for LLM:**

* Generate the code for `ProgressDashboardScreen.tsx`.
* Use `@supabase/supabase-js` to fetch set data and calculate progress metrics.
* Design a visually appealing and informative dashboard UI.