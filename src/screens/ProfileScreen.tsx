import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { User } from '../types';

/**
 * Profile Screen
 * 
 * Frontend Integration:
 * - Fetches current user from GET /api/auth/me
 * - Displays user profile information
 * - Provides logout functionality
 */
export const ProfileScreen: React.FC = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      console.error('Error loading user profile:', err);
      const errorMessage =
        err.response?.data?.error || 'Failed to load profile. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled automatically by AppNavigator
              // when isAuthenticated becomes false
            } catch (err) {
              console.error('Logout error:', err);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={loadUser}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  // Profile content
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileSection}>
        {/* Profile Photo */}
        <View style={styles.imageContainer}>
          {user?.profileImageUrl ? (
            <Image
              source={{ uri: user.profileImageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Photo</Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.infoSection}>
          {user?.name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>
          )}

          {user?.age !== undefined && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>{user.age}</Text>
            </View>
          )}

          {(user?.university || user?.education) && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>University</Text>
              <Text style={styles.value}>{user.university || user.education}</Text>
            </View>
          )}

          {user?.location && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{user.location}</Text>
            </View>
          )}

          {user?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.actionsSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  profileSection: {
    marginBottom: 32,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceLight,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '400',
  },
  actionsSection: {
    marginTop: 8,
  },
  logoutButton: {
    width: '100%',
  },
});
