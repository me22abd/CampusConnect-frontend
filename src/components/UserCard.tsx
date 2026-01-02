import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { User } from '../types';
import { colors } from '../theme/colors';

interface UserCardProps {
  user: User;
}

/**
 * User Card Component
 * Displays user information in a card format
 */
export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const profileImage = user.profileImageUrl || user.photos?.[0];

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Photo</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name || 'Anonymous'}</Text>
          {user.age && <Text style={styles.age}>, {user.age}</Text>}
        </View>

        {(user.university || user.education) && (
          <Text style={styles.education}>
            {user.university || user.education}
          </Text>
        )}

        {user.location && (
          <Text style={styles.location}>{user.location}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: colors.surfaceLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  infoContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  age: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  education: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.textDisabled,
  },
});

