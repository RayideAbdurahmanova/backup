import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    Animated,
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

    // animation

    const imageAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        Animated.sequence([
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(titleAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);


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
                <Animated.Image
                    source={require('../../assets/images/mosqueBig.png')}
                    style={[
                        styles.image,
                        {
                            opacity: imageAnim,
                            transform: [
                                {
                                    scale: imageAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.6, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                />

                <Animated.Text
                    style={[
                        styles.title,
                        {
                            opacity: titleAnim,
                            transform: [
                                {
                                    translateY: titleAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    Xoş Gəlmişsiniz!
                </Animated.Text>


            </View>

            {/* FOOTER BUTTON */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]}>
                <Animated.View
                    style={[
                        styles.footer,
                        {
                            paddingBottom: insets.bottom + 18,
                            opacity: buttonAnim,
                            transform: [
                                {
                                    translateY: buttonAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [30, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <TouchableOpacity style={styles.button} onPress={handleStart}>
                        <Text style={styles.buttonText}>Başla</Text>
                    </TouchableOpacity>
                </Animated.View>

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
        width: 300,
        height: 300,
        marginBottom: 24,
    },

    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.text,
        textAlign:"center",
        marginTop: 20,
        // opacity: 0.5,
    },

    footer: {
        paddingHorizontal: 24,
    },

    button: {
        width: '100%',
        backgroundColor: "#40643a",
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
