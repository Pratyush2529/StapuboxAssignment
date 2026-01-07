import axios from 'axios';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL + '/',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': process.env.EXPO_PUBLIC_API_TOKEN,
    },
    timeout: 10000,
});

export const sendOtp = async (mobile) => {
    try {
        console.log('📤 [API] Sending OTP...');
        console.log('📱 Mobile:', mobile);
        console.log('🔗 URL:', `${process.env.EXPO_PUBLIC_API_BASE_URL}/sendOtp`);

        const response = await api.post('sendOtp', { mobile });

        console.log('✅ [API] Send OTP Response Received');

        if (response.data?.status === 'success') {
            console.log('✅ [API] Send OTP Successful');
            return { success: true, data: response.data };
        } else {
            console.log('❌ [API] Send OTP Failed:', response.data?.msg);
            return {
                success: false,
                error: response.data?.msg || 'Failed to send OTP. Please try again.',
            };
        }
    } catch (error) {
        console.error('❌ [API] Send OTP Error:', error.message);

        return {
            success: false,
            error: error.response?.data?.message || 'Network Error. Please check your connection.',
        };
    }
};

export const resendOtp = async (mobile) => {
    try {
        console.log('🔄 [API] Resending OTP...');
        console.log('📱 Mobile:', mobile);
        console.log('🔗 URL:', `${process.env.EXPO_PUBLIC_API_BASE_URL}/resendOtp?mobile=${mobile}`);

        const response = await api.post(`resendOtp?mobile=${mobile}`);

        console.log('✅ [API] Resend OTP Response Received');

        if (response.data?.status === 'success') {
            console.log('✅ [API] Resend OTP Successful');
            return { success: true, data: response.data };
        } else {
            console.log('❌ [API] Resend OTP Failed:', response.data?.msg);
            return {
                success: false,
                error: response.data?.msg || 'Failed to resend OTP. Please try again.',
            };
        }
    } catch (error) {
        console.error('❌ [API] Resend OTP Error:', error.message);

        return {
            success: false,
            error: error.response?.data?.message || 'Network Error. Please try again.',
        };
    }
};

export const verifyOtp = async (mobile, otp) => {
    try {
        console.log('🔐 [API] Verifying OTP...');
        console.log('📱 Mobile:', mobile);

        const response = await api.post(`verifyOtp?mobile=${mobile}&otp=${otp}`);

        console.log('✅ [API] Verify OTP Response Received');

        if (response.data?.status === 'success') {
            console.log('✅ [API] OTP Verification Successful');
            return { success: true, data: response.data };
        } else {
            console.log('❌ [API] OTP Verification Failed:', response.data.msg);
            return {
                success: false,
                error: 'Wrong OTP Entered',
            };
        }
    } catch (error) {
        console.error('❌ [API] Verify OTP Error:', error.message);

        return {
            success: false,
            error: error.response?.data?.message || 'Invalid OTP. Please try again.',
        };
    }
};

export default api;