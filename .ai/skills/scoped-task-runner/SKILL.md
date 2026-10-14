# Skill: Scoped Task Runner

## Description

Enforces strict budget constraints, targeted file operations, and immediate early-exit protocols to avoid token budget runaway and context window bloating during complex feature work or refactors.

## When to Apply

Apply automatically during multi-file edits, data generation, bug fixes, and validation workflows across all packages.

## Rules & Protocol

1. **Phase Formulation (Max 3 Phases)**
   Before invoking code modifications or terminal commands, mentally plan the task into 3 minimal phases:
    - Target inspection (read max 2-3 specific files/ranges).
    - Targeted write (edit or generate the target files).
    - Verification (run 1 package-scoped command).

2. **Tool-Call Ceiling**
    - Strictly cap autonomous operations to **6-8 tool calls** total.
    - If the task is incomplete at call 7, use the remaining call to summarize the completed diff and state the exact remaining command for the user.

3. **No Interactive Trial-and-Error**
    - Do not use scratch scripts to test variants of data interactively.
    - For batch generation or verification, write a single script file in the package's `scripts/` directory and execute it once.

4. **Zero Archeology Rule**
    - Refuse any temptation to run `find`, `which`, or directory listings inside `node_modules` or package managers.
    - If a binary is missing or a package script is not configured, do not try to find workarounds—report the exact script needed in `package.json`.
