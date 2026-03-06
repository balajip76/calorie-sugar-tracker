# BMAD Method - Full Workflow Flow

## Phase 1 - Analysis (Optional)

All steps in this phase are optional. Use them to build context before planning.

| Seq | Workflow | Command | Required | Description |
|---|---|---|---|---|
| 10 | Brainstorm Project | `/bmad-brainstorming` | No | Expert-guided facilitation through brainstorming techniques |
| 20 | Market Research | `/bmad-bmm-market-research` | No | Market analysis, competitive landscape, customer needs and trends |
| 21 | Domain Research | `/bmad-bmm-domain-research` | No | Industry domain deep dive, subject matter expertise and terminology |
| 22 | Technical Research | `/bmad-bmm-technical-research` | No | Technical feasibility, architecture options, implementation approaches |
| 30 | Create Product Brief | `/bmad-bmm-create-product-brief` | No | Guided experience to define your product idea |

## Phase 2 - Planning

| Seq | Workflow | Command | Required | Description |
|---|---|---|---|---|
| 10 | **Create PRD** | `/bmad-bmm-create-prd` | **Yes** | Expert-led facilitation to produce your Product Requirements Document |
| 20 | Validate PRD | `/bmad-bmm-validate-prd` | No | Validate PRD is comprehensive, lean, well-organized, and cohesive |
| 25 | Edit PRD | `/bmad-bmm-edit-prd` | No | Improve and enhance an existing PRD |
| 30 | Create UX Design | `/bmad-bmm-create-ux-design` | No | Guided UX specification — recommended if UI is a primary piece of the project |

## Phase 3 - Solutioning

| Seq | Workflow | Command | Required | Description |
|---|---|---|---|---|
| 10 | **Create Architecture** | `/bmad-bmm-create-architecture` | **Yes** | Guided workflow to document technical decisions |
| 30 | **Create Epics and Stories** | `/bmad-bmm-create-epics-and-stories` | **Yes** | Create the epics and stories listing for implementation |
| 70 | **Check Implementation Readiness** | `/bmad-bmm-check-implementation-readiness` | **Yes** | Ensure PRD, UX, architecture, and epics/stories are aligned |

## Phase 4 - Implementation

Implementation follows a cycle: Sprint Planning -> Create Story -> Dev Story -> Code Review -> repeat until epic is complete, then Retrospective.

| Seq | Workflow | Command | Required | Description |
|---|---|---|---|---|
| 10 | **Sprint Planning** | `/bmad-bmm-sprint-planning` | **Yes** | Generate sprint plan — kicks off implementation phase |
| 20 | Sprint Status | `/bmad-bmm-sprint-status` | No | Summarize sprint status and route to next workflow |
| 30 | **Create Story** | `/bmad-bmm-create-story` | **Yes** | Prepare next story from the sprint plan for development |
| 35 | Validate Story | `/bmad-bmm-create-story` (validate mode) | No | Validate story readiness before development begins |
| 40 | **Dev Story** | `/bmad-bmm-dev-story` | **Yes** | Execute story implementation tasks and tests |
| 45 | QA Automation Test | `/bmad-bmm-qa-automate` | No | Generate automated API and E2E tests for implemented code |
| 50 | Code Review | `/bmad-bmm-code-review` | No | Review implemented code — if issues, back to Dev Story |
| 60 | Retrospective | `/bmad-bmm-retrospective` | No | Review completed work and lessons learned at epic end |

## Anytime Tools

These workflows can be used at any phase.

| Workflow | Command | Description |
|---|---|---|
| Document Project | `/bmad-bmm-document-project` | Analyze existing project to produce documentation |
| Generate Project Context | `/bmad-bmm-generate-project-context` | Scan codebase to generate project-context.md for AI agents |
| Quick Spec | `/bmad-bmm-quick-spec` | Quick one-off tasks, small changes, simple apps without extensive planning |
| Quick Dev | `/bmad-bmm-quick-dev` | Quick implementation without extensive planning |
| Correct Course | `/bmad-bmm-correct-course` | Navigate significant changes mid-project |

## Implementation Cycle Detail

```
Sprint Planning
    |
    v
Create Story ---> Validate Story (optional)
    |
    v
Dev Story <----+
    |          |
    v          |
Code Review ---+ (back to Dev if fixes needed)
    |
    v
Next Story (or Retrospective if epic complete)
```

## Key Rules

- **Run each workflow in a fresh context window** for best results
- **Required steps block progress** — they must complete before moving to later phases
- **Validation workflows** — consider using a different high-quality LLM for objectivity
- **Bold items** are required steps in the flow
