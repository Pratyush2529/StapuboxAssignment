import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    NativeModules,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verifyOtp, resendOtp } from '../api/api';
import CustomAlert from '../components/CustomAlert';

const VerifyScreen = ({ route, navigation }) => {
    const { mobile } = route.params;
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'error' });
    const inputRefs = useRef([]);

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const startSmsListener = async () => {
            try {
                if (Platform.OS === 'android' && !NativeModules.RNOtpVerify) {
                    return;
                }

                const OtpModule = require('react-native-otp-verify');
                const RNOtpVerify = OtpModule.default || OtpModule;

                if (!RNOtpVerify || typeof RNOtpVerify.getOtp !== 'function') {
                    return;
                }

                const hash = await RNOtpVerify.getHash();

                await RNOtpVerify.getOtp();
                RNOtpVerify.addListener(message => {
                    try {
                        if (message && message !== 'Timeout Error.') {
                            const otpMatch = /(\d{4})/.exec(message);
                            if (otpMatch && otpMatch[1]) {
                                const receivedOtp = otpMatch[1];
                                const otpArray = receivedOtp.split('');
                                setOtp(otpArray);
                                handleVerifyOtp(receivedOtp);
                            }
                        }
                    } catch (e) {
                        // error parsing message
                    }
                });
            } catch (err) {
                // auto-read activation failed
            }
        };

        startSmsListener();

        return () => {
            try {
                if (Platform.OS === 'android') {
                    const OtpModule = require('react-native-otp-verify');
                    const RNOtpVerify = OtpModule.default || OtpModule;
                    if (RNOtpVerify && typeof RNOtpVerify.removeListener === 'function') {
                        RNOtpVerify.removeListener();
                    }
                }
            } catch (e) {
                // ignore
            }
        };
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleOtpChange = (value, index) => {
        if (value && !/^\d+$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');
        if (value && index < 3) inputRefs.current[index + 1].focus();
        if (index === 3 && value && newOtp.join('').length === 4) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = async (otpValue = null) => {
        const otpToVerify = otpValue || otp.join('');
        if (otpToVerify.length !== 4) {
            Alert.alert('Error', 'Please enter complete 4-digit OTP');
            return;
        }
        setLoading(true);
        try {
            const result = await verifyOtp(mobile, otpToVerify);
            if (result.success) {
                setAlertConfig({ title: 'Success', message: 'OTP verified successfully!', type: 'success' });
                setAlertVisible(true);
            } else {
                setError(result.error);
                setOtp(['', '', '', '']);
                inputRefs.current[0].focus();
            }
        } catch (err) {
            setAlertConfig({ title: 'Error', message: 'Something went wrong. Please try again.', type: 'error' });
            setAlertVisible(true);
            setOtp(['', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        setResendLoading(true);
        setError('');
        try {
            const result = await resendOtp(mobile);
            if (result.success) {
                setAlertConfig({ title: 'Success', message: 'OTP sent successfully!', type: 'success' });
                setAlertVisible(true);
                setCountdown(60);
                setCanResend(false);
                setOtp(['', '', '', '']);
                inputRefs.current[0].focus();
            } else {
                setAlertConfig({ title: 'Error', message: result.error, type: 'error' });
                setAlertVisible(true);
            }
        } catch (err) {
            setAlertConfig({ title: 'Error', message: 'Failed to resend OTP. Please try again.', type: 'error' });
            setAlertVisible(true);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2C2C2E" />
            <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Phone Verification</Text>
                    <View style={styles.placeholder} />
                </View>
                <Text style={styles.subtitle}>Enter 4 digit OTP sent to your phone number</Text>
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.otpInput}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            autoFocus={index === 0}
                            editable={!loading}
                        />
                    ))}
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity onPress={handleResendOtp} disabled={!canResend || resendLoading}>
                    <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
                        {resendLoading ? 'Sending...' : canResend ? 'Resend OTP' : `Resend OTP (${countdown}s)`}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => {
                    setAlertVisible(false);
                    if (alertConfig.type === 'success' && alertConfig.message === 'OTP verified successfully!') {
                        navigation.navigate('Home');
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2C2C2E' },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3A3A3C', alignItems: 'center', justifyContent: 'center' },
    backButtonText: { fontSize: 28, color: '#FFFFFF', fontWeight: '300' },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    placeholder: { width: 40 },
    subtitle: { fontSize: 18, color: '#FFFFFF', marginBottom: 40, lineHeight: 24 },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    otpInput: { width: 60, height: 60, backgroundColor: '#3A3A3C', borderRadius: 12, fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF', borderWidth: 1, borderColor: '#3A3A3C' },
    errorText: { color: '#FF3B30', fontSize: 14, marginBottom: 16 },
    resendText: { fontSize: 16, color: '#0A84FF', fontWeight: '600' },
    resendTextDisabled: { color: '#666' },
});

export default VerifyScreen;
