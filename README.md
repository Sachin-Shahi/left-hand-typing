# Left-Hand Typing Practice

A lightweight, minimal-dependency web application designed to help users practice and master typing specifically with their left hand on a standard QWERTY keyboard.

## Features

- **Curated Word Bank**: Practices only strict left-hand words (e.g., *sweater*, *create*, *after*, *stare*).
- **Strict Error Enforcement**: Immediately blocks incorrect keystrokes and provides visual feedback, reinforcing muscle memory.
- **Real-time Metrics**: Live tracking of Words Per Minute (WPM) and typing accuracy.
- **Visual Keyboard**: On-screen keyboard highlights correct and incorrect key presses in real-time.
- **Performance Optimized**: Instantaneous DOM updates ensure zero typing lag even at high speeds.

## How to Run

This project consists entirely of static HTML, CSS, and JavaScript. No build steps or package installations are required.

### Option 1: Direct File
Simply open the `index.html` file in your preferred web browser.

### Option 2: Local Server (Recommended)
Run a simple HTTP server in the project directory:

**Using Python:**
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

**Using Node.js:**
```bash
npx serve
```

## Customization

The test duration and word bank can be customized by editing the corresponding variables at the top of `app.js`.
