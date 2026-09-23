# STAGES.md — KIIT Node

The SDLC as it actually runs here. Not Waterfall's straight line. A loop, after the first pass.

## 1. Feasibility & Requirement Analysis — done
The 30-student survey. Real demand confirmed before any code existed.

## 2. Planning & Design — done
PRD.md, schema.sql, wireframes, stack decisions in DECISIONS.md.

## 3. Implementation — active now
Small, continuous increments off one backlog. No fixed sprints.

## 4. Testing — woven through stage 3
Not a separate gate at the end. Jest and Maestro tests land with the feature that needs them, not after.

## 5. Deployment — continuous
APK plus GitHub Release now. Most future fixes ship without a full rebuild.

## 6. Feedback Loop — after launch
Real usage data feeds back into stage 2. This is the stage Waterfall doesn't have. The loop is: 3 -> 4 -> 5 -> 6 -> back into 2.

## 7. Maintenance
Folded into the same loop as stage 6, not a separate tail phase.

## Kanban board columns
Backlog -> In Progress -> Review -> Testing -> Done. Keep In Progress capped at one item per person at a time. A card doesn't move to Review until it builds, lints, and passes its own tests.

## Current stage
Stage 3, Implementation. Update this line as the project moves.
