[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/E5ATIiJe)
# Group assignment 02 - AR/VR Demo

The task is to continue the development of the first assignment and implement it into an AR or VR application by using the WebXR standard.

## Rating

- Presentation and idea: 30 %

- WebXR (AR/VR) concept: 40 %

- Code quality: 30 %

## Explanation

### How to use
1. Visit the [GitHub Pages link](https://hfu-dm-ecg.github.io/group-assignment-1-webxr-team-spass/) to this repository using a device capable of running AR based web applications. If no device is available, one can be emulated using the [WebXR API Emulator](https://chrome.google.com/webstore/detail/webxr-api-emulator/mjddjgeghkdijejnciaefnkjmkafnnje/related?hl=de) for Google Chrome.
2. Press the "Enter XR" button at the top of the page.
3. You can now see floating islands and an airship in front of you.

### Controls
You can control the airship using the joystick on the screen.

### Additional Information
The models are based on the first assignment, but the animations for the airship have been removed, as the user now controls its flight path. The islands still float up and down. The joystick is created using the [nipplejs package](https://yoannmoi.net/nipplejs/) and implemented in two new functions in the island.js file. To create the overlay displaying the joystick, the optional feature "dom-overlay" has been enabled in the ARButton.js file. The application has been tested on different phones and the aforementioned WebXR API Emulator.