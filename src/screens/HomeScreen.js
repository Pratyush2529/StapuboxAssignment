import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2C2C2E" />
            <View style={styles.content}>
                <View style={styles.successIcon}>
                    <Text style={styles.checkmark}>✓</Text>
                </View>
                <Text style={styles.title}>Login Successful!</Text>
                <Text style={styles.subtitle}>Welcome to StapuBox. You have successfully verified your mobile number.</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
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
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkmark: {
        fontSize: 40,
        color: '#FFFFFF',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#CCCCCC',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#0A84FF',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomeScreen;
