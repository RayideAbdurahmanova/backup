import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../themes/styles';
import { SvgImage } from '../components/svgImages/SvgImages';

interface SettingsHeaderProps {
    title: string;
    onBackPress?: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
    title,
    onBackPress
}) => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={Platform.OS === 'android' ? false : undefined}
            />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBackPress}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <SvgImage
                        source={require('../assets/svg/thirdPage/leftVector.svg')}
                        width={18}
                        height={18}
                        fill={COLORS.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title}
                </Text>
                <View style={styles.placeholder} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBackground,
        backgroundColor: COLORS.background,
        minHeight: 56,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 40,
        marginTop: -2,
    },
    backText: {
        fontSize: 32,
        color: COLORS.primary,
        fontWeight: '300',
        lineHeight: 32,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.text,
        flex: 1,
        // textAlign: 'center',
        paddingHorizontal: 8,
    },
    placeholder: {
        width: 40,
    },
});
