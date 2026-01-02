import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Match } from '../types';
import { colors } from '../theme/colors';

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

/**
 * Match Card Component
 * Displays a matched user in a card format
 * Tappable to navigate to chat
 */
export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
  const profileImage = match.user.profileImageUrl;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
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
          <Text style={styles.name}>{match.user.name || 'Anonymous'}</Text>
          {match.user.age && <Text style={styles.age}>, {match.user.age}</Text>}
        </View>

        {match.user.university && (
          <Text style={styles.university}>{match.user.university}</Text>
        )}

        {match.user.location && (
          <Text style={styles.location}>{match.user.location}</Text>
        )}
      </View>
    </TouchableOpacity>
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
    height: 200,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  age: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  university: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: colors.textDisabled,
  },
});

