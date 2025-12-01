---
description: Update ARCHITECTURE.md to match changes made in the current session
---
1. **Review Session Changes**: Identify what files were created, modified, or deleted during the current task/session.
    - Did you add a new page?
    - Did you create a new UI component?
    - Did you modify the database schema or types?
    - Did you change authentication or routing logic?

2. **Analyze Architectural Impact**: Determine if these changes require an update to `ARCHITECTURE.md`.
    - **New Components**: Add them to the "UI Components" list.
    - **New Pages**: Add them to the "Project Structure" or "Key Flows" section.
    - **Data Model Changes**: Update the "Data Models" section.
    - **Tech Stack Updates**: Update the "Tech Stack" section if new libraries were added.

3. **Update Documentation**: Modify `ARCHITECTURE.md` to reflect *only* the current state.
    - **CRITICAL**: Do NOT scan the entire codebase unless necessary to verify context. Focus on what changed.
    - **CRITICAL**: Do NOT include future plans.
    - **CRITICAL**: Ensure the "Project Structure" tree remains accurate if files were moved or renamed.
