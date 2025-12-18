fix this :
# DimScreen – Multi-Display Brightness Control

DimScreen is a lightweight **Electron.js desktop application** that allows you to **control screen brightness across multiple displays**, even beyond system limits. Perfect for anyone who finds their screens too bright or needs precise control over multiple monitors.

---

## Features
- Dim internal and external displays simultaneously
- Works across all applications and system tray
- Keyboard shortcuts for easy brightness adjustment

---

## Installation & Running the App

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Multi-Display-DimScreen-Electron-js-app.git
cd Multi-Display-DimScreen-Electron-js-app
#2. Install dependencies
bash

npm install
#3. Run the app in development 
bash

npm start
The app will appear in your system tray.

#Usage
Keyboard Shortcuts:

CTRL + Arrow Up → Increase brightness

CTRL + Arrow Down → Decrease brightness

Access and control brightness directly from the system tray icon.

Packaging as an Executable (.exe)
DimScreen uses electron-builder to create executable files:
bash
npm run build
The .exe file will be generated in the dist/ folder

You can distribute it to run on Windows without Node.js installed

#Tech Stack
Electron.js – Desktop application framework

JavaScript – Core application logic

Node.js – Backend runtime for Electron

#Notes
Ensure you have Node.js installed before running locally

For multiple monitors, make sure all displays are connected and recognized by the system
