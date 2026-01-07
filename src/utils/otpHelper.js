import RNOtpVerify from 'react-native-otp-verify';

export const startOtpListener = (onOtpReceived) => {
    try {
        RNOtpVerify.getHash()
            .then((hash) => {
                console.log('App Hash for SMS:', hash);
            })
            .catch((error) => {
                console.error('Error getting hash:', error);
            });

        RNOtpVerify.getOtp()
            .then(() => {
                console.log('OTP listener started');
            })
            .catch((error) => {
                console.error('Error starting OTP listener:', error);
            });

        const otpHandler = RNOtpVerify.addListener((message) => {
            try {
                const otpMatch = /(\d{4})/g.exec(message);
                if (otpMatch && otpMatch[1]) {
                    const otp = otpMatch[1];
                    onOtpReceived(otp);
                }
                RNOtpVerify.removeListener();
            } catch (error) {
                console.error('Error extracting OTP:', error);
            }
        });

        return () => {
            RNOtpVerify.removeListener();
        };
    } catch (error) {
        console.error('Error in startOtpListener:', error);
        return () => { };
    }
};

export const stopOtpListener = () => {
    try {
        RNOtpVerify.removeListener();
    } catch (error) {
        console.error('Error stopping OTP listener:', error);
    }
};

export const getAppHash = async () => {
    try {
        const hash = await RNOtpVerify.getHash();
        return hash[0];
    } catch (error) {
        console.error('Error getting app hash:', error);
        return null;
    }
};
