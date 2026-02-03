import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../themes/styles';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = '@ramadan_onboarding_completed';

const OnboardingScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleStart = async () => {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainTabs' as never }],
            })
        );
    };

    return (
        <View style={styles.container}>
            {/* CONTENT */}
            <View style={[styles.content, { paddingTop: insets.top }]}>
                <Image
                    source={require('../../assets/images/mosqueBig.png')}
                    style={styles.image}
                />

                <Text style={styles.title}>
                    Xoş Gəlmişsiniz!
                </Text>
            </View>

            {/* FOOTER BUTTON */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]}>
                <TouchableOpacity style={styles.button} onPress={handleStart}>
                    <Text style={styles.buttonText}>Başla</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnboardingScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    image: {
        width: 400,
        height: 400,
        marginBottom: 24, 
    },

    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.text,
        textAlign: 'center',
    },

    footer: {
        paddingHorizontal: 24,
    },

    button: {
        width: '100%',        
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 28,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
