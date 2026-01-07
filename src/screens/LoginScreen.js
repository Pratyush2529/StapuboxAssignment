import React, { useState } from 'react';
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
} from 'react-native';
import { sendOtp } from '../api/api';
import CustomAlert from '../components/CustomAlert';

const LoginScreen = ({ navigation }) => {
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'error' });

    const validateMobile = (number) => {
        const mobileRegex = /^[0-9]{10}$/;
        return mobileRegex.test(number);
    };

    const handleSendOtp = async () => {
        setError('');

        if (!validateMobile(mobile)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);

        try {
            const result = await sendOtp(mobile);

            if (result.success) {
                navigation.navigate('Verify', { mobile });
            } else {
                setError(result.error);
                setAlertConfig({ title: 'Error', message: result.error, type: 'error' });
                setAlertVisible(true);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setAlertConfig({ title: 'Error', message: 'Something went wrong. Please try again.', type: 'error' });
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2C2C2E" />

            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.title}>Login to Your Account</Text>

                <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCodeContainer}>
                        <Text style={styles.countryCode}>+91</Text>
                        <Text style={styles.dropdownIcon}>▼</Text>
                    </View>

                    <TextInput
                        style={styles.phoneInput}
                        placeholder="9999999999"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        maxLength={10}
                        value={mobile}
                        onChangeText={(text) => {
                            setMobile(text);
                            setError('');
                        }}
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!validateMobile(mobile) || loading) && styles.sendButtonDisabled
                    ]}
                    onPress={handleSendOtp}
                    disabled={!validateMobile(mobile) || loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send OTP</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.createAccountContainer}>
                    <Text style={styles.createAccountText}>Don't have account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.createAccountLink}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 40,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A3A3C',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        minWidth: 75,
        marginRight: 12,
    },
    countryCode: {
        fontSize: 16,
        color: '#FFFFFF',
        marginRight: 4,
    },
    dropdownIcon: {
        fontSize: 10,
        color: '#FFFFFF',
    },
    phoneInput: {
        flex: 1,
        backgroundColor: '#3A3A3C',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    sendButton: {
        backgroundColor: '#0A84FF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    sendButtonDisabled: {
        backgroundColor: '#3A3A3C',
        opacity: 0.5,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    createAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAccountText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    createAccountLink: {
        fontSize: 14,
        color: '#0A84FF',
        fontWeight: '600',
    },
});

export default LoginScreen;
