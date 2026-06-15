import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../constants/theme';
import { getCurrentUserProfile } from '../src/services/auth';

/**
 * Home Dashboard Screen
 * Displays monitoring status, status of sensors, trusted contacts, and an interactive hold-to-test SOS button.
 * Includes a simulated bottom navigation bar matching the Figma layout.
 */
export default function HomeScreen() {
  const router = useRouter();
  const [isSOSHolding, setIsSOSHolding] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (profile && profile.name && isMounted) {
          setUserName(profile.name);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSOSPressIn = () => {
    setIsSOSHolding(true);
  };

  const handleSOSPressOut = () => {
    setIsSOSHolding(false);
  };

  const handleSOSLongPress = () => {
    Alert.alert(
      "TEST SOS TRIGGERED",
      "This is a simulation of the SOS emergency trigger. If connected, it would fetch your location and alert your primary contacts.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Greeting */}
        <Text style={styles.greeting}>Hi, {userName}</Text>

        {/* Monitoring Active Card */}
        <View style={styles.monitoringCard}>
          <Text style={styles.monitoringText}>MONITORING ACTIVE</Text>
        </View>

        {/* Sensors Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SENSORS</Text>
          <View style={styles.row}>
            <View style={styles.dashedPill}>
              <Text style={styles.pillText}>accel </Text>
              <Ionicons name="checkmark" size={16} color={Colors.light.text} />
            </View>
            <View style={styles.dashedPill}>
              <Text style={styles.pillText}>gyro </Text>
              <Ionicons name="checkmark" size={16} color={Colors.light.text} />
            </View>
            <View style={styles.dashedPill}>
              <Text style={styles.pillText}>GPS </Text>
              <Ionicons name="checkmark" size={16} color={Colors.light.text} />
            </View>
          </View>
        </View>

        {/* Trusted Contacts Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>TRUSTED</Text>
          <View style={styles.row}>
            <View style={styles.dashedPill}>
              <Text style={styles.pillText}>MOM</Text>
            </View>
            <View style={styles.dashedPill}>
              <Text style={styles.pillText}>DAD</Text>
            </View>
            <View style={styles.dashedPill}>
              <Text style={styles.pillText}>RAY</Text>
            </View>
            <View style={styles.dashedPill}>
              <Text style={styles.pillText}>MAHI</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.dashedPill, styles.addPill]}
              onPress={() => Alert.alert("Add Contact", "Would navigate to add trusted contact screen.")}
            >
              <Text style={styles.pillText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HOLD TO TEST SOS Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handleSOSPressIn}
          onPressOut={handleSOSPressOut}
          onLongPress={handleSOSLongPress}
          delayLongPress={1500} // Requires holding for 1.5s
          style={[styles.sosButton, isSOSHolding && styles.sosButtonActive]}
        >
          <Text style={styles.sosButtonText}>
            {isSOSHolding ? "HOLDING..." : "HOLD TO TEST SOS"}
          </Text>
        </TouchableOpacity>

        {/* Debug Log out button to return to Splash */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/' as any)}
        >
          <Text style={styles.logoutText}>Return to Splash (Debug)</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Simulated Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Home')}
        >
          <Ionicons
            name="home"
            size={24}
            color={activeTab === 'Home' ? Colors.light.accent : Colors.light.text}
          />
          <Text style={[styles.tabLabel, activeTab === 'Home' && styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('Contacts');
            Alert.alert("Contacts Navigation", "Simulated Contacts Screen");
          }}
        >
          <Ionicons
            name="call-outline"
            size={24}
            color={activeTab === 'Contacts' ? Colors.light.accent : Colors.light.text}
          />
          <Text style={[styles.tabLabel, activeTab === 'Contacts' && styles.tabLabelActive]}>Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('History');
            Alert.alert("History Navigation", "Simulated Alerts History Screen");
          }}
        >
          <Ionicons
            name="time-outline"
            size={24}
            color={activeTab === 'History' ? Colors.light.accent : Colors.light.text}
          />
          <Text style={[styles.tabLabel, activeTab === 'History' && styles.tabLabelActive]}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('Profile');
            Alert.alert("Profile Navigation", "Simulated Profile Settings Screen");
          }}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={activeTab === 'Profile' ? Colors.light.accent : Colors.light.text}
          />
          <Text style={[styles.tabLabel, activeTab === 'Profile' && styles.tabLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100, // Safe padding for bottom navigation bar
    alignItems: 'center',
  },
  greeting: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  monitoringCard: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 20,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  monitoringText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 22,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dashedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: Colors.light.cardBackground,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  addPill: {
    minWidth: 44,
    justifyContent: 'center',
  },
  sosButton: {
    backgroundColor: Colors.light.primary,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  sosButtonActive: {
    backgroundColor: Colors.light.accent,
  },
  sosButtonText: {
    color: Colors.light.primaryText,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginTop: 30,
    padding: 10,
  },
  logoutText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: Colors.light.cardBackground,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 4,
  },
  tabLabelActive: {
    color: Colors.light.accent,
  },
});
