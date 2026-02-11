import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import { COLORS, FONTS } from '../themes/styles';

const { width } = Dimensions.get('window');

export interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    buttons?: AlertButton[];
    onDismiss?: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    buttons = [{ text: 'OK', style: 'default' }],
    onDismiss,
}) => {
    const handleButtonPress = (button: AlertButton) => {
        if (button.onPress) {
            button.onPress();
        }
        if (onDismiss) {
            onDismiss();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onDismiss}
            >
                <View style={styles.alertContainer}>
                    <TouchableOpacity activeOpacity={1}>
                        <View style={styles.alertContent}>
                            {/* Header with decorative element */}
                            <View style={styles.headerDecoration}>
                                <View style={styles.decorativeLine} />
                                <View style={styles.decorativeCircle} />
                                <View style={styles.decorativeLine} />
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>{title}</Text>

                            {/* Message */}
                            <Text style={styles.message}>{message}</Text>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {buttons.map((button, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.button,
                                            button.style === 'cancel' &&
                                            styles.cancelButton,
                                            button.style === 'destructive' &&
                                            styles.destructiveButton,
                                            buttons.length === 1 &&
                                            styles.singleButton,
                                        ]}
                                        onPress={() =>
                                            handleButtonPress(button)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                button.style === 'cancel' &&
                                                styles.cancelButtonText,
                                                button.style ===
                                                'destructive' &&
                                                styles.destructiveButtonText,
                                            ]}
                                        >
                                            {button.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: width * 0.85,
        maxWidth: 400,
    },
    alertContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.3,
        // shadowRadius: 8,
        // elevation: 8,
    },
    headerDecoration: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    decorativeLine: {
        width: 40,
        height: 2,
        backgroundColor: COLORS.primary,
        borderRadius: 1,
    },
    decorativeCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginHorizontal: 8,
    },
    title: {
        fontFamily: FONTS.PoppinsBold,
        fontSize: 20,
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontFamily: FONTS.PoppinsRegular,
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // shadowColor: COLORS.primary,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 4,
        // elevation: 3,
    },
    singleButton: {
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    destructiveButton: {
        backgroundColor: '#ff4444',
        shadowColor: '#ff4444',
    },
    buttonText: {
        fontFamily: FONTS.PoppinsSemiBold,
        fontSize: 16,
        color: '#fff',
    },
    cancelButtonText: {
        color: '#bb0c0c',
    },
    destructiveButtonText: {
        color: '#fff',
    },
});
