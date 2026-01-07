import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

const CustomAlert = ({ visible, title, message, onClose, type = 'error' }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            type === 'success' ? styles.successButton : styles.errorButton
                        ]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    alertContainer: {
        backgroundColor: '#3A3A3C',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 340,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#CCCCCC',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successButton: {
        backgroundColor: '#0A84FF',
    },
    errorButton: {
        backgroundColor: '#0A84FF',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CustomAlert;
