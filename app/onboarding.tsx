import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  useWindowDimensions,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('responza_carousel_onboarding_completed', 'true');
      router.replace('/permissions' as any); // Navigate to permissions onboarding
    } catch (err) {
      console.error('[ONBOARDING] Failed to save onboarding state:', err);
      router.replace('/permissions' as any);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < 2) {
      scrollViewRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  // Avatar Node helper for Screen 3
  const AvatarNode = ({ 
    top, 
    left, 
    hairColor, 
    skinColor, 
    shirtColor 
  }: { 
    top: number; 
    left: number; 
    hairColor: string; 
    skinColor: string; 
    shirtColor: string; 
  }) => (
    <View style={[styles.avatarNode, { top, left }]}>
      <View style={styles.avatarInner}>
        {/* Hair */}
        <View style={[styles.avatarHair, { backgroundColor: hairColor }]} />
        {/* Face */}
        <View style={[styles.avatarFace, { backgroundColor: skinColor }]} />
        {/* Shirt */}
        <View style={[styles.avatarShirt, { backgroundColor: shirtColor }]} />
      </View>
    </View>
  );

  // Vector Illustration: Guardian & Shield (Screen 1)
  const renderGuardianIllustration = () => (
    <View style={styles.illustrationBox}>
      {/* Background soft red glow ring */}
      <View style={styles.backgroundGlowRing} />
      <View style={styles.guardianContainer}>
        {/* Stylized Human Figure */}
        {/* Legs */}
        <View style={[styles.guardianLeg, { left: 42 }]} />
        <View style={[styles.guardianLeg, { right: 42 }]} />
        {/* Shoes */}
        <View style={[styles.guardianShoe, { left: 40 }]} />
        <View style={[styles.guardianShoe, { right: 40 }]} />
        {/* Arms/Shoulders */}
        <View style={styles.guardianShoulders} />
        {/* Neck */}
        <View style={styles.guardianNeck} />
        {/* Head */}
        <View style={styles.guardianHead} />
        {/* Hair */}
        <View style={styles.guardianHair} />

        {/* Shield Overlay */}
        <View style={styles.shieldContainer}>
          {/* Left half (lighter red) */}
          <View style={styles.shieldLeftHalf} />
          {/* Right half (darker red) */}
          <View style={styles.shieldRightHalf} />
          {/* Highlight line down middle */}
          <View style={styles.shieldCenterLine} />
        </View>
      </View>
    </View>
  );

  // Vector Illustration: Overlapping Phones (Screen 2)
  const renderPhonesIllustration = () => (
    <View style={styles.illustrationBox}>
      {/* Isometric transformed phone wrapper */}
      <View style={styles.isometricWrapper}>
        
        {/* Concentric Wireless Signal Waves (Tilted isometrically) */}
        <View style={[styles.isometricWave, { width: 80, height: 80, borderRadius: 40, opacity: 0.8, top: 40, left: 10 }]} />
        <View style={[styles.isometricWave, { width: 130, height: 130, borderRadius: 65, opacity: 0.5, top: 15, left: -15 }]} />
        <View style={[styles.isometricWave, { width: 180, height: 180, borderRadius: 90, opacity: 0.3, top: -10, left: -40 }]} />
        <View style={[styles.isometricWave, { width: 230, height: 230, borderRadius: 115, opacity: 0.15, top: -35, left: -65 }]} />

        {/* Back Phone */}
        <View style={[styles.phoneFrame, styles.phoneFrameBack]}>
          <View style={styles.phoneScreenBack} />
        </View>

        {/* Front Phone */}
        <View style={[styles.phoneFrame, styles.phoneFrameFront]}>
          <View style={styles.phoneScreenFront}>
            {/* Screen content/notch */}
            <View style={styles.phoneFrontNotch} />
            
            {/* Central sensor node and glowing dot */}
            <View style={styles.sensorDotGlowOuter}>
              <View style={styles.sensorDotGlowInner}>
                <View style={styles.sensorDotCore} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Vector Illustration: Location Pin & Connected Contacts (Screen 3)
  const renderLocationIllustration = () => (
    <View style={styles.illustrationBox}>
      {/* Circle path connecting nodes */}
      <View style={styles.networkCircleLine} />

      {/* Avatar Node positions around center (120, 120) with R=80 */}
      {/* Top Center */}
      <AvatarNode top={15} left={102} hairColor="#2C2C2E" skinColor="#FFCDA8" shirtColor="#007AFF" />
      {/* Top Right */}
      <AvatarNode top={48} left={172} hairColor="#8A624A" skinColor="#FCD5B5" shirtColor="#FF9500" />
      {/* Bottom Right */}
      <AvatarNode top={138} left={172} hairColor="#1C1C1E" skinColor="#C68B59" shirtColor="#34C759" />
      {/* Bottom Center */}
      <AvatarNode top={172} left={102} hairColor="#2C2C2E" skinColor="#FFCDA8" shirtColor="#E22D2D" />
      {/* Bottom Left */}
      <AvatarNode top={138} left={32} hairColor="#4A4A4A" skinColor="#F3D2C1" shirtColor="#30B0C7" />
      {/* Top Left */}
      <AvatarNode top={48} left={32} hairColor="#D1A153" skinColor="#FCD5B5" shirtColor="#5856D6" />

      {/* Central Location Pin */}
      <View style={styles.locationPinContainer}>
        <View style={styles.locationPinBody}>
          <View style={styles.locationPinInnerCircle}>
            {/* Heart icon in the location pin to represent contacts */}
            <Ionicons name="heart" size={15} color="#E22D2D" />
          </View>
        </View>
        <View style={styles.locationPinPointer} />
        {/* Pin base shadow */}
        <View style={styles.locationPinShadow} />
      </View>
    </View>
  );

  return (
    <LinearGradient 
      colors={['#FFFFFF', '#FCE8E6']} 
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header containing Skip button */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          {activeIndex < 2 ? (
            <TouchableOpacity onPress={completeOnboarding} style={styles.skipButton} activeOpacity={0.7}>
              <Text style={styles.skipButtonText}>{"Skip"}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipButtonSpacer} />
          )}
        </View>

        {/* Swipeable Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {/* Slide 1 */}
          <View style={[styles.slide, { width }]}>
            {renderGuardianIllustration()}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{"Your silent guardian."}</Text>
              <Text style={styles.body}>
                {"Responza watches over you 24/7 using your phone's sensors, so help can reach you even when you can't speak, type, or move."}
              </Text>
            </View>
          </View>

          {/* Slide 2 */}
          <View style={[styles.slide, { width }]}>
            {renderPhonesIllustration()}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{"Detects what you can't report."}</Text>
              <Text style={styles.body}>
                {"Falls, sudden impacts and prolonged inactivity are detected automatically using your phone's accelerometer and gyroscope."}
              </Text>
            </View>
          </View>

          {/* Slide 3 */}
          <View style={[styles.slide, { width }]}>
            {renderLocationIllustration()}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{"Help, dispatched silently."}</Text>
              <Text style={styles.body}>
                {"If you don't respond, Responza securely shares your live location with your trusted contacts so they can reach you quickly."}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Unified Bottom Controls */}
        <View style={styles.footer}>
          {/* Page Indicators */}
          <View style={styles.indicatorContainer}>
            {[0, 1, 2].map((index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  activeIndex === index ? styles.dotActive : styles.dotInactive
                ]} 
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleNext} 
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {activeIndex === 2 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  headerSpacer: {
    width: 48,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipButtonSpacer: {
    width: 48,
  },
  skipButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationBox: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimensions.get('window').height < 700 ? 24 : 48,
    position: 'relative',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    alignItems: 'center',
    gap: 24,
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#000000',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#C7C7CC',
  },
  primaryButton: {
    backgroundColor: '#000000',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // VECTOR ILLUSTRATIONS STYLING

  // Screen 1: Guardian
  backgroundGlowRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: '#E22D2D',
    opacity: 0.08,
  },
  guardianContainer: {
    width: 140,
    height: 160,
    alignItems: 'center',
    position: 'relative',
  },
  guardianHair: {
    position: 'absolute',
    top: 2,
    width: 32,
    height: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#2C2C2E',
    zIndex: 4,
  },
  guardianHead: {
    position: 'absolute',
    top: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E22D2D', // Red face silhouetted
    zIndex: 3,
  },
  guardianNeck: {
    position: 'absolute',
    top: 32,
    width: 8,
    height: 12,
    backgroundColor: '#E22D2D',
    zIndex: 2,
  },
  guardianShoulders: {
    position: 'absolute',
    top: 40,
    width: 60,
    height: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#2C2C2E',
    zIndex: 1,
  },
  guardianLeg: {
    position: 'absolute',
    bottom: 12,
    width: 12,
    height: 55,
    backgroundColor: '#2C2C2E',
  },
  guardianShoe: {
    position: 'absolute',
    bottom: 6,
    width: 16,
    height: 7,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  shieldContainer: {
    position: 'absolute',
    top: 48,
    width: 90,
    height: 100,
    flexDirection: 'row',
    zIndex: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  shieldLeftHalf: {
    flex: 1,
    height: '100%',
    backgroundColor: '#E22D2D',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 45,
    borderWidth: 2,
    borderRightWidth: 0,
    borderColor: '#2C2C2E',
  },
  shieldRightHalf: {
    flex: 1,
    height: '100%',
    backgroundColor: '#B51E1E',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 45,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderColor: '#2C2C2E',
  },
  shieldCenterLine: {
    position: 'absolute',
    left: '50%',
    width: 1,
    height: '100%',
    backgroundColor: '#FFFFFF',
    opacity: 0.25,
  },

  // Screen 2: Isometric Overlapping Phones
  isometricWrapper: {
    width: 200,
    height: 200,
    position: 'relative',
    transform: [{ rotateX: '60deg' }, { rotateZ: '-45deg' }],
  },
  isometricWave: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#E22D2D',
  },
  phoneFrame: {
    width: 100,
    height: 160,
    borderRadius: 18,
    borderWidth: 3,
    backgroundColor: '#2C2C2E',
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  phoneFrameBack: {
    top: 30,
    left: -20,
    borderColor: '#4A4A4C',
    zIndex: 1,
  },
  phoneScreenBack: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: '#1C1C1E',
  },
  phoneFrameFront: {
    top: 0,
    left: 10,
    borderColor: '#E5E5EA', // Light metal frame
    zIndex: 2,
  },
  phoneScreenFront: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    paddingTop: 6,
    position: 'relative',
  },
  phoneFrontNotch: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2C2C2E',
  },
  sensorDotGlowOuter: {
    position: 'absolute',
    top: 65,
    left: 35,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(226, 45, 45, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorDotGlowInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(226, 45, 45, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorDotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  // Screen 3: Location Network
  networkCircleLine: {
    position: 'absolute',
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    borderStyle: 'dashed',
    top: 32,
    left: 32,
  },
  avatarNode: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  avatarInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  avatarHair: {
    width: 24,
    height: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute',
    top: 2,
    zIndex: 2,
  },
  avatarFace: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    top: 6,
    zIndex: 1,
  },
  avatarShirt: {
    width: 22,
    height: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  locationPinContainer: {
    width: 44,
    height: 60,
    position: 'absolute',
    top: 90,
    left: 98,
    alignItems: 'center',
    zIndex: 4,
  },
  locationPinBody: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E22D2D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  locationPinInnerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPinPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E22D2D',
    position: 'absolute',
    bottom: 8,
    zIndex: 1,
  },
  locationPinShadow: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    position: 'absolute',
    bottom: 2,
    zIndex: 0,
  },
});
