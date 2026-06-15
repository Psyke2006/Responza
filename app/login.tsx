import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

/**
 * Login Screen
 * Collects email/phone and password, and routes the user to the Home Dashboard on submission.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // For now, since we do not connect backend yet, directly navigate to Home Dashboard
    router.replace('/home' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>log in to resume monitoring</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            <Input
              label="Email or mobile Number"
              placeholder="email or phone"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              keyboardType="email-address"
            />

            <Input
              label="Password"
              placeholder="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Forgot Password Link */}
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => console.log('Forgot Password pressed')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View style={styles.footer}>
            <Button title="Log in" onPress={handleLogin} />

            {/* Navigation back helper */}
            <TouchableOpacity 
              onPress={() => router.push('/signup' as any)} 
              style={styles.signupLink}
            >
              <Text style={styles.signupLinkText}>{"Don't have an account? Sign up"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.light.link,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  signupLink: {
    marginTop: 15,
  },
  signupLinkText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
