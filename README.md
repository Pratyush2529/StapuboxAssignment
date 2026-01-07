# StapuBox Mobile Auth Flow

This is my submission for the StapuBox Mini-Assignment. I have built a secure, modern mobile authentication flow using React Native and Expo. The app features a clean dark-themed UI and includes advanced features like automated OTP reading on Android.

## 📺 Project Demo

*Demo Video*

https://github.com/user-attachments/assets/a7ad5786-3413-4c83-8f08-d0bc43822a9c

### 📥 Download Link
- [Download Working APK](./builds/StapuBoxAssignment_v1.0.apk?raw=true)

## ✨ Key Features
- **OTP Generation**: Validates mobile numbers and triggers the backend OTP service.
- **Smart OTP Input**: 4-digit input fields with auto-focus switching and auto-submit functionality.
- **SMS Auto-Read**: Automatically detects and fills the OTP from incoming SMS (Android).
- **Custom UI Components**: Branded dark-themed alerts and modals instead of generic system popups.
- **Resend Logic**: Integrated 60-second cooldown timer for security and better UX.

## 🛠 Tech Stack
- **Framework**: Expo / React Native
- **Navigation**: React Navigation (Stack)
- **Networking**: Axios
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Icons**: Ionicons (via Expo Vector Icons)

## 🚀 How to Run Locally

### 1. Installation
```bash
git clone <repo-url>
cd StapuboxAssignment
npm install
```

### 2. Environment Setup
Create a `.env` file in the root and add the following:
```env
EXPO_PUBLIC_API_BASE_URL=https://stapubox.com/trial
EXPO_PUBLIC_API_TOKEN=your_api_token
```

### 3. Start the App
```bash
npx expo start
```
Scan the QR code using the **Expo Go** app on your phone.

## 📱 Build Details (Android)
The SMS auto-read feature uses the **Google SMS Retriever API**. 
- To test the APK, I used `eas build --profile preview`.
- The SMS must follow the format: `<#> Your OTP is 1234. {AppHash}`.

## 📝 Implementation Notes
- **Security**: Used environment variables to handle API endpoints and tokens securely.
- **UX**: Implemented `KeyboardAvoidingView` to ensure the layout remains accessible when the keyboard is open.
- **Performance**: Used `StyleSheet.create` for optimized native styling.
- **Stability**: Added safety checks for the `RNOtpVerify` module to ensure the app doesn't crash in different environments like Expo Go.
