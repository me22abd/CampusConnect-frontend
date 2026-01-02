import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ReceivedLike } from '../services/like.service';
import { Button } from './Button';
import { colors } from '../theme/colors';

interface ReceivedLikeCardProps {
  user: ReceivedLike;
  onLikeBack: () => void;
  liking: boolean;
}

/**
 * Received Like Card Component
 * Displays a user who has liked the current user
 * Includes Like Back button
 */
export const ReceivedLikeCard: React.FC<ReceivedLikeCardProps> = ({
  user,
  onLikeBack,
  liking,
}) => {
  const profileImage = user.profileImageUrl;

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

        {user.university && (
          <Text style={styles.university}>{user.university}</Text>
        )}

        <Button
          title="Like Back"
          onPress={onLikeBack}
          loading={liking}
          disabled={liking}
          style={styles.likeButton}
        />
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
    height: 300,
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
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  age: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  university: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  likeButton: {
    width: '100%',
  },
});

