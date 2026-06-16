# ADR 0001: Hybrid Agent Routing Architecture

## Status
Accepted

## Context
In this monorepo workspace, we utilize AI agents to automate and assist with developer workflows (such as Git commits, accessibility audits, and component styling). To route these agents effectively based on user intent, we use a central agent router file ([AGENTS.md](file:///Users/swoo/Workspaces/de-absolutholz/AGENTS.md)) at the root.

As the repository grows to encompass multiple packages (e.g., `libraries/design-system`), we must determine where to house the specific agent profiles and skill guidelines, particularly those that only apply to a single library (such as component-specific structures and Storybook rules).

## Options Considered

### Option 1: Completely Centralized (All files in root `/.ai/`)
Keep all agent profiles and skills in the root level `/.ai/agents/` and `/.ai/skills/` directories, regardless of which package they govern.

* **Pros:**
  * All configurations are located in a single central directory.
* **Cons:**
  * Pollutes the root namespace with instructions that only apply to individual subprojects.
  * Lacks encapsulation; if a package is moved, its documentation and custom developer rules are separated from the code.

### Option 2: Completely Decentralized (Nested agent routers)
Store both the agent router registries (`AGENTS.md`) and their target files entirely inside the subprojects (e.g., a registry in `libraries/design-system/AGENTS.md`). The root router would delegate routing control down to the package-level routers.

* **Pros:**
  * Maximum package encapsulation.
* **Cons:**
  * Introduces redirection and lookup indirection, requiring multiple steps for an agent to resolve its target profile.
  * High risk of routing failure if the LLM or developer tooling parser does not recursively follow nested routers.

### Option 3: Hybrid Architecture (Recommended & Selected)
Maintain a single flat routing registry at the root ([AGENTS.md](file:///Users/swoo/Workspaces/de-absolutholz/AGENTS.md)), but relocate specific agent profile and skill files to their respective packages (e.g. under `libraries/design-system/.ai/agents/`).

* **Pros:**
  * **Direct Intent Mapping:** Allows agents and parsers to immediately locate profiles in a single step at the root.
  * **High Encapsulation:** Guidelines that govern a specific package (such as design system component structure and Storybook CSF guidelines) live directly inside the package, keeping the monorepo root clean.
* **Cons:**
  * The root router must point to subdirectory paths (e.g. `/libraries/design-system/.ai/...`).

## Decision
We chose **Option 3 (Hybrid Architecture)**. 

The monorepo's root [AGENTS.md](file:///Users/swoo/Workspaces/de-absolutholz/AGENTS.md) acts as the central routing system mapping user intents, while the actual profile files and skills are colocated with the codebase they govern (e.g. within `/libraries/design-system/.ai/`). This maximizes parsing compatibility for agent orchestration while preserving clean repository boundaries and strict code encapsulation.
