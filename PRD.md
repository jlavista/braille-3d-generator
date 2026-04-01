# Planning Guide

A web application that translates user-entered text into Grade 1 braille and generates a 3D-printable model (STL format) with visual preview, enabling users to create tactile braille labels and signs.

**Experience Qualities**:
1. **Accessible** - The tool should be intuitive for users who want to create physical braille, with clear visual feedback of the translation.
2. **Precise** - Braille dot spacing and dimensions must follow official standards to ensure readability.
3. **Immediate** - Real-time translation and 3D preview as users type, with instant STL generation.

**Complexity Level**: Light Application (multiple features with basic state)
- This app handles text input, braille translation, 3D model generation, and file export - typical of a specialized conversion tool with real-time preview.

## Essential Features

### Text Input & Translation
- **Functionality**: Accept text input and translate to Grade 1 braille in real-time
- **Purpose**: Allow users to see their text converted to braille instantly
- **Trigger**: User types in the text field
- **Progression**: User types text → System translates to braille → Display braille characters visually → Update 3D preview
- **Success criteria**: All standard ASCII characters translate correctly to braille, updates happen within 100ms of typing

### 3D Model Preview
- **Functionality**: Render a 3D visualization of the braille text using Three.js
- **Purpose**: Let users see exactly what the physical braille will look like before exporting
- **Trigger**: Braille translation updates
- **Progression**: Braille data generated → 3D geometry created with proper dot heights and spacing → Camera positioned for optimal view → Render with lighting and controls
- **Success criteria**: Braille dots are clearly visible, model can be rotated/zoomed, dimensions match standard braille specifications

### STL Export
- **Functionality**: Generate and download a standard STL file of the braille model
- **Purpose**: Enable users to 3D print the braille text
- **Trigger**: User clicks "Download STL" button
- **Progression**: User clicks export → System generates STL file from 3D geometry → Browser downloads file with descriptive name
- **Success criteria**: STL file opens in slicing software, dimensions are accurate for 3D printing

### Customization Options
- **Functionality**: Allow users to adjust base dimensions and dot parameters
- **Purpose**: Support different use cases (signs, labels, tags) and printer capabilities
- **Trigger**: User adjusts sliders or inputs
- **Progression**: User changes parameters → 3D model regenerates → Preview updates
- **Success criteria**: Changes reflect immediately in preview, valid ranges prevent impossible geometries

## Edge Case Handling

- **Empty Input**: Display placeholder message in 3D view prompting user to enter text
- **Unsupported Characters**: Show warning and either skip or use fallback representation for characters without braille equivalents
- **Very Long Text**: Implement character limit or line wrapping to prevent performance issues and unwieldy models
- **Zero Dimensions**: Validate inputs to prevent zero or negative values that would break geometry generation
- **Export Before Typing**: Disable download button until valid text is entered

## Design Direction

The design should feel technical and precise, reflecting the engineering nature of creating physical objects. It should balance the clinical accuracy required for braille specification with warmth and approachability for users new to braille. Visual clarity is paramount - the interface should clearly separate input, settings, preview, and actions.

## Color Selection

A technical palette with warm accents to balance precision with accessibility.

- **Primary Color**: Deep teal (oklch(0.45 0.08 210)) - Conveys technical precision and trust
- **Secondary Colors**: Warm gray backgrounds (oklch(0.96 0.005 90)) for content areas, creating subtle warmth
- **Accent Color**: Bright amber (oklch(0.72 0.15 75)) for call-to-action buttons and highlights, adding energy and drawing attention to key actions
- **Foreground/Background Pairings**: 
  - Background (Light Warm Gray oklch(0.98 0.005 90)): Dark Gray text (oklch(0.25 0.01 240)) - Ratio 12.1:1 ✓
  - Primary (Deep Teal oklch(0.45 0.08 210)): White text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Bright Amber oklch(0.72 0.15 75)): Dark text (oklch(0.20 0.01 240)) - Ratio 8.2:1 ✓

## Font Selection

Typefaces should convey technical precision while remaining friendly and readable.

- **Primary Font**: Space Grotesk - A geometric sans-serif with technical character but rounded warmth, perfect for a tool that bridges digital and physical
- **Monospace Font**: JetBrains Mono - For displaying braille characters and technical specifications with precise alignment

**Typographic Hierarchy**:
- H1 (App Title): Space Grotesk Bold / 32px / -0.02em letter spacing
- H2 (Section Headers): Space Grotesk SemiBold / 18px / -0.01em letter spacing
- Body (Labels, Instructions): Space Grotesk Regular / 15px / normal letter spacing
- Monospace (Braille Display): JetBrains Mono Regular / 24px / 0.05em letter spacing
- Small (Helper Text): Space Grotesk Regular / 13px / normal letter spacing

## Animations

Animations should reinforce the sense of precision and provide clear feedback for technical operations.

- 3D model transitions use smooth easing when regenerating geometry
- Input focus transitions have subtle scale and glow effects 
- Download button has a satisfying press animation with brief success state
- Parameter changes trigger gentle fade transitions in the preview
- Loading states for STL generation use a circular progress indicator

## Component Selection

- **Components**: 
  - Input/Textarea for text entry with clear focus states
  - Card components to separate functional areas (input, preview, settings)
  - Slider components for dimensional parameters with live value display
  - Button (primary variant) for STL download with Phosphor download icon
  - Label components for all inputs and parameters
  - Separator to divide sections cleanly
  - Tooltip for explaining braille specifications and parameters
  - Badge to display character count and validation status

- **Customizations**: 
  - Custom Three.js canvas component for 3D preview with OrbitControls
  - Custom braille translation function implementing Grade 1 braille mapping
  - Custom STL generator function to export Three.js geometry
  - Visual braille character display component showing the translated dots

- **States**: 
  - Input: Default, Focused (teal ring), Disabled (grayed)
  - Button: Default, Hover (lift shadow), Active (press down), Disabled (grayed), Success (brief green pulse after download)
  - Slider: Default, Dragging (larger thumb), Disabled
  - 3D Canvas: Loading (skeleton), Interactive (with controls), Empty state

- **Icon Selection**: 
  - Download icon (ArrowDown) for STL export
  - TextAa for input section
  - Cube for 3D preview section
  - Sliders for parameters section
  - Info for tooltips and help text

- **Spacing**: 
  - Page padding: p-6 on mobile, p-8 on desktop
  - Card gaps: gap-6 between major sections
  - Form spacing: gap-4 within forms, gap-2 for label-input pairs
  - Button padding: px-6 py-3 for primary actions

- **Mobile**: 
  - Single column layout stacking input → preview → settings → actions
  - 3D preview gets minimum height of 300px on mobile, expandable
  - Settings collapse into accordion on mobile to save space
  - Download button becomes full-width on mobile
  - Text input grows to comfortable minimum height for typing
