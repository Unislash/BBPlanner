# Legendary Rater Tavernkeeper Scene Design

## Purpose

This document defines the UI and interaction design for the `legendary rater` feature as an in-world Battle Brothers tavern scene.

The goal is to make the feature feel like the user is standing with a tavernkeeper over a wooden table, placing named items down for appraisal, while keeping the workflow fast and readable as a web app.

This is a product and implementation design document, not a mood board.

## Design Intent

The legendary rater should feel like:

- the user lays an item on the barkeeper's table
- the barkeeper looks it over and records an appraisal
- the user reads off or enters the rolled stats from the item
- the barkeeper gives a verdict on the item's quality

The legendary rater should not feel like:

- a spreadsheet
- a generic admin form
- a detached calculator with medieval colors

## Core User Flow

The user flow remains simple.

1. User opens the legendary rater.
2. User sees the tavern table scene.
3. User chooses an item category.
4. User chooses a specific named item.
5. The chosen item is placed in the inspection area on the table.
6. The appraisal sheet appears beside it.
7. User enters the rolled stats from the actual item.
8. Changed rows become visually marked as inspected.
9. The barkeeper verdict updates live.

The user should always understand:

- what item is currently being inspected
- which rows they should enter
- which rows are only reference
- what the final verdict means

## Narrative Framing

The feature is diegetic. The UI should behave as if it is part of the world.

Narrative frame:

- The app background is the barkeeper's table.
- The selected item is physically placed on the table.
- The stat and verdict area is a handwritten or ledger-like appraisal sheet.
- The barkeeper is implied through copy and layout, not represented as a full character portrait.

This should be atmospheric, but restrained. The fiction supports the workflow. It must not slow the workflow down.

## Background Image Requirement

The user already has a background image for the app and wants it used.

This image should be treated as the primary environmental layer for the legendary rater scene.

Requirements:

- It should fill the legendary rater scene area, not necessarily the entire application shell unless that also suits the surrounding app.
- It should represent the barkeeper's wooden table or tavern inspection surface.
- It should allow readable foreground UI with overlays, shadows, and contrast treatment.
- It should not be blurred so heavily that it loses material character.
- It should not be so high contrast that text and item imagery become hard to read.

Recommended implementation:

- Use the image as a scene background on the legendary rater container.
- Add one dark vignette overlay and one warm light overlay above it.
- Place all interactive elements above those overlays.

Suggested layering:

1. Background image
2. Dark edge vignette
3. Warm candlelight or tavern-light gradient
4. Tabletop objects: item panel, appraisal sheet, category controls

If the provided image is very detailed, reduce noise with a subtle translucent wash instead of blur.

## Experience Goals

### Primary goals

- Make item selection feel tactile.
- Make stat entry feel like appraisal, not data entry.
- Make the verdict feel like a barkeeper's judgment.
- Preserve fast scanning and low friction.

### Secondary goals

- Increase thematic immersion.
- Make named items feel more special.
- Make the legendary rater visually distinct from the planner UI.

### Non-goals

- Simulating a full NPC conversation system
- Building a game scene with real-time 3D or complex animation
- Hiding important stats behind roleplay or flavor text

## Visual System

### Scene composition

The evaluator should be composed like a tabletop still life.

Main objects:

- `Placed item`
- `Appraisal sheet`
- `Category strip / item selection tray`
- `Verdict block`

Layout concept on desktop:

- Left or center-left: item placed on the wood
- Right: appraisal sheet, slightly angled or layered
- Top or upper edge: category selection controls
- Lower or right section of the sheet: stat rows

Layout concept on mobile:

- Top: category controls
- Middle: placed item
- Bottom: appraisal sheet

The mobile version should preserve the same fiction, but simplify overlaps and angles.

### Material language

The UI should be built from three main material groups.

#### 1. Table wood

- Dark, worn, tavern-like
- Visible grain and wear
- Supports shadows from objects placed above it

#### 2. Appraisal paper

- Warm parchment or ledger paper
- Slight edge wear
- Strong readability
- Should feel like something physically lying on the table

#### 3. Metal and ink accents

- Brass, iron, or warm gold accents for emphasis
- Dark brown or black ink for labels and judgment notes
- Redder or warmer marks for standout value judgments

### Typography

The typography should separate atmosphere from utility.

- Item name and verdict title: decorative serif already used in the project is appropriate
- Labels, ranges, and controls: simple readable UI type
- Flavor copy: short, sparse, and lower contrast than the important values

Rules:

- Large display headers only for item name and verdict
- Small uppercase labels for sections
- No large paragraphs
- No faux-handwritten font for primary UI text unless readability is excellent

## Information Architecture

The evaluator should be visually divided into these sections.

### 1. Item Inspection Area

Purpose:

- Anchor the scene
- Show what item is being judged

Contents:

- Large selected item image
- Item name
- Item type label such as `Named Weapon` or `Named Shield`
- Optional alternate appearances

Behavior:

- The item should appear placed on the table
- A small entry transition is acceptable

### 2. Appraisal Sheet

Purpose:

- Hold the barkeeper's working notes and judgment

Contents:

- Intro line or short barkeeper prompt
- Verdict block
- Stat entry rows
- Supporting note explaining that only changed rows affect rating

The appraisal sheet should be the main interactive surface.

### 3. Verdict Block

Purpose:

- Present the barkeeper's conclusion clearly

Contents:

- Verdict title
- Numeric summary
- Very short supporting line

Examples of acceptable verdict labels:

- `Poor`
- `Decent`
- `Strong`
- `Excellent`
- `Godly`

Optional future enhancement:

- In-world flavor subline such as `Worth a fine purse.` or `I've seen better steel.`

That should remain optional. The main verdict must remain clear and functional.

### 4. Stat Ledger

Purpose:

- Let the user enter rolled stats
- Show how strong each entered roll is

Each row should include:

- stat icon
- stat name
- valid range
- one or two inputs
- percentile result
- visual state showing whether the row has been changed from default

## Interaction Rules

### Item selection

Category selection should feel like sorting goods on the table, but still behave like standard tabs.

Requirements:

- Clearly active category
- Fast switching
- Good keyboard and pointer usability

Item grid behavior:

- Hover state should suggest item selection
- Clicking should feel like choosing which item to place down
- Selected item should transition into the inspection layout

### Stat entry

Stat rows should support fast numeric entry without breaking immersion.

Requirements:

- Negative numbers must be easy to type
- Temporary input states such as `-` must be allowed during entry
- Rows changed from default must become visually distinct
- Untouched rows should remain readable but less emphasized

Visual states:

- `Reference`: untouched row
- `Inspected`: row changed from default
- `High quality`: optional accent for very high percentile values

### Rating behavior

Current intended behavior should remain:

- rating is based on rolled rows actually entered by the user
- untouched rows are not treated as meaningful rolls
- durability only matters for defensive item types where it is materially important

The UI must communicate this directly and plainly.

Recommended supporting copy:

- `Only inspected rows count toward the rating.`

Or:

- `Only rolled rows count toward this appraisal.`

## Content Tone

The copy should sound in-world, but never theatrical.

Good tone:

- terse
- experienced
- grounded
- practical

Bad tone:

- chatty
- jokey
- exaggerated fake medieval speech

Examples:

- `Set it down.`
- `Let's see what sort of work this is.`
- `Only rolled rows count toward the appraisal.`
- `Fine craft.`
- `Nothing special, but serviceable.`

Avoid:

- long monologues
- heavy accent writing
- slang that feels out of place

## Motion

Motion should support tabletop physicality, not call attention to itself.

Allowed motions:

- item slides or settles into place
- appraisal sheet fades or drifts in slightly
- verdict updates with a light emphasis pulse
- hovered item tiles lift subtly

Motion limits:

- keep transitions short
- do not animate every stat change heavily
- do not add decorative motion that delays input

## Accessibility and Usability

The feature is themed, but must still work like a usable application.

Requirements:

- text contrast must remain strong on parchment surfaces
- inputs must remain clearly focusable
- category and item selection must remain keyboard navigable
- rating labels must be understandable without relying only on color
- mobile layout must remain usable without overlap collisions

Themed surfaces must never make the inputs hard to find or operate.

## Technical Approach

### Existing relevant files

- [src/legendaryRating/components/Evaluator/Evaluator.tsx](/home/brent/git/bbplanner/src/legendaryRating/components/Evaluator/Evaluator.tsx)
- [src/legendaryRating/components/Evaluator/LegendaryStatBar.tsx](/home/brent/git/bbplanner/src/legendaryRating/components/Evaluator/LegendaryStatBar.tsx)
- [src/legendaryRating/components/LegendaryPicker/LegendaryPicker.tsx](/home/brent/git/bbplanner/src/legendaryRating/components/LegendaryPicker/LegendaryPicker.tsx)
- [src/legendaryRating/components/LegendaryPicker/ArchetypeGridItem.tsx](/home/brent/git/bbplanner/src/legendaryRating/components/LegendaryPicker/ArchetypeGridItem.tsx)
- [src/app.css](/home/brent/git/bbplanner/src/app.css)

### Recommended structure changes

#### Evaluator

Responsibilities:

- scene container
- placed item area
- appraisal sheet layout
- verdict block
- note copy

#### LegendaryStatBar

Responsibilities:

- render each ledger row
- manage temporary input state
- show changed state
- display percentile

#### CSS

Add a dedicated visual grouping for the tavern scene, for example:

- `.legendaryTableScene`
- `.legendarySceneBackdrop`
- `.legendaryPlacedItem`
- `.legendaryAppraisalSheet`
- `.legendaryVerdictBlock`
- `.legendaryLedgerRow`

This should reduce cross-contamination with the rest of the app styles.

## Asset Requirements

### Required assets

- barkeeper table background image supplied by user
- item images already present

### Optional supporting assets

- subtle paper texture overlay
- wax seal or coin marker
- faint stain or ring texture

Optional assets should only be added if they do not clutter the interaction.

## Implementation Phases

### Phase 1: Scene shell

Deliverables:

- integrate tavern table background image
- establish scene overlays and lighting
- split evaluator into `placed item` and `appraisal sheet`

Success criteria:

- the legendary rater clearly reads as an in-world tabletop scene

### Phase 2: Appraisal sheet redesign

Deliverables:

- convert current evaluator card into paper/ledger styling
- redesign verdict block
- tighten copy into short barkeeper-style language

Success criteria:

- the UI no longer reads like a generic form card

### Phase 3: Stat ledger redesign

Deliverables:

- rows styled as ledger lines
- clear changed-row state
- improved emphasis for rolled rows

Success criteria:

- user can immediately identify which rows they entered and which rows are reference

### Phase 4: Picker immersion

Deliverables:

- restyle category selector and item grid to feel like item sorting on a table
- improve visual transition from item selection to inspection

Success criteria:

- selecting an item feels like placing it on the table for judgment

### Phase 5: Motion polish

Deliverables:

- restrained transitions for item placement and sheet reveal
- subtle verdict update emphasis

Success criteria:

- motion adds atmosphere without slowing use

## Acceptance Criteria

The redesign is successful if all of the following are true:

- A first-time user can understand how to rate an item without explanation.
- The scene clearly feels like a barkeeper table appraisal.
- The provided background image is meaningfully integrated into the experience.
- The item remains visually central.
- The stat entry area remains fast and legible.
- Changed rows are obvious.
- The verdict is prominent and easy to interpret.
- The mobile layout preserves the same theme without becoming cluttered.

## Open Decisions

These items should be decided before final polish.

1. Should the barkeeper verdict labels remain purely functional, or shift to more in-world names?
2. Should the appraisal sheet sit straight for readability, or slightly angled for atmosphere?
3. Should alternate item appearances be shown as physical miniatures on the table, or as simple thumbnails?
4. Should the barkeeper flavor line be static, or vary by rating tier?
5. Where exactly should the user-provided background asset live in the repo once added?

## Recommended Next Step

Use this document to implement `Phase 1` first:

- add the background image to the repo
- wire it into the legendary rater scene container
- restructure the evaluator into `placed item` plus `appraisal sheet`

That is the smallest meaningful step that makes the direction concrete.
