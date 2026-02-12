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
    Linking
} from 'react-native';
import { COLORS, FONTS } from '../../themes/styles';
import { SettingsHeader } from '../../components/SettingsHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgImage } from '../../components/svgImages/SvgImages';

const CollaborationScreen: React.FC = () => {

    const phoneCall = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${+994501234567}';
        } else {
            phoneNumber = 'telprompt:${+994501234567}';
        }
        Linking.openURL(phoneNumber);
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SettingsHeader title="Əməkdaşlıq" />
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
                            Bizimlə əməkdaşlıq edərək iftar menyunuzu daha çox insanla paylaşın.
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.phoneContainer}
                        onPress={() => Linking.openURL('https://forms.gle/your-google-form-link')}
                    >
                        <Text style={styles.phoneText}>İftar menyunu paylaş</Text>
                    </TouchableOpacity>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CollaborationScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 20,
    },
    scrollContentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingBottom: 0,
        paddingHorizontal: 16,
        paddingTop: 20,
        backgroundColor: COLORS.background,
    },
    infoBox: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 14,
        // marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
        opacity: 0.8,
    },
    phoneContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        marginTop: 20,
    },
    phoneText: {
        fontSize: 18,
        fontFamily: FONTS.PoppinsSemiBold,
        color: "#fff",
    },

});
