import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    StatusBar,
    Keyboard,
} from 'react-native';
import { COLORS, FONTS } from '../../themes/styles';
import { SettingsHeader } from '../../components/SettingsHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContactScreen: React.FC = () => {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SettingsHeader title="Əlaqə" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    contentContainerStyle={styles.scrollContentContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <StatusBar
                        barStyle={'dark-content'}
                        backgroundColor={COLORS.background}
                    />
                    {/* Info Card */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Sualın və ya təklifin var? Bizə yaz
                        </Text>
                    </View>

                    {/* Name */}
                    <Text style={styles.label}>Adınız və soyadınız</Text>
                    <TextInput
                        placeholder="Əli Əliyev"
                        placeholderTextColor={COLORS.text + '70'}
                        style={styles.input}
                    />

                    {/* Email */}
                    <Text style={styles.label}>Elektron poçt ünvanınız</Text>
                    <TextInput
                        placeholder="info@ifra.az"
                        placeholderTextColor={COLORS.text + '70'}
                        style={styles.input}
                        keyboardType="email-address"
                    />

                    {/* Phone */}
                    <Text style={styles.label}>Telefon nömrəniz</Text>
                    <TextInput
                        placeholder="+994 (50) 123 45 67"
                        placeholderTextColor={COLORS.text + '70'}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />

                    {/* Message */}
                    <Text style={styles.label}>Qeydiniz</Text>
                    <TextInput
                        placeholder="Sizinlə əməkdaşlıq etməyə hazıram..."
                        placeholderTextColor={COLORS.text + '70'}
                        style={[styles.input, styles.textArea]}
                        multiline
                    />

                    {/* Send Button */}
                    <TouchableOpacity style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Göndər</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ContactScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: StatusBar.currentHeight || 0,
    },
    scrollContentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingBottom: 0,
        paddingHorizontal: 16,
        paddingTop: 24,
        backgroundColor: COLORS.background,
    },
    infoBox: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 14,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
        opacity: 0.8,
    },

    label: {
        fontSize: 13,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
        marginBottom: 6,
        marginTop: 12,
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
    },

    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },

    sendButton: {
        marginTop: 32,
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    sendButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: FONTS.PoppinsBold,
    },
});
