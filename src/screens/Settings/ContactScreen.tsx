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

const ContactScreen: React.FC = () => {

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
                            Sualın və ya təklifin var?{'\n'}
                            Bizimlə əlaqə saxlayın.
                        </Text>
                    </View>

                    <View style={[styles.phoneContainer, { marginTop: 40 }]}>
                        <SvgImage
                            source={require('../../assets/svg/thirdPage/phone.svg')}
                            width={20}
                            height={20}
                        // color="#ff4444"
                        />
                        <TouchableOpacity
                            onPress={phoneCall}
                        >
                            <Text style={styles.phoneText}>+994 (50) 123 45 67</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.phoneContainer}>
                        <SvgImage
                            source={require('../../assets/svg/thirdPage/email.svg')}
                            width={20}
                            height={20}
                        // color="#ff4444"
                        />
                        <TouchableOpacity
                            onPress={() => Linking.openURL('mailto:info@iftar.az')}
                        >
                            <Text style={styles.phoneText}>info@iftar.az</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.formText}>Əməkdaşlıq etmək üçün formu doldurun.</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://forms.gle/your-google-form-link')}
                            style={{ marginTop: 16 }}
                        >
                            <Text style={styles.googleFormText}>Google Forms</Text>
                        </TouchableOpacity>
                    </View>


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
        marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
        opacity: 0.8,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 12,
        marginBottom: 24,
    },
    phoneText: {
        fontSize: 16,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
        marginLeft: 12,
    },
    formContainer: {
        marginTop: 20,
        marginBottom: 24,
    },
    formText: {
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
    },
    googleFormText: {
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: "#D2691E",
    },
});
