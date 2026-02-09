/**
 * BudgetBuddy — Profile Screen
 * File: src/screens/ProfileScreen.tsx
 *
 * Displays the anonymous user's profile and app settings.
 * Features:
 * - Shows the auto-generated anonymous user ID (truncated)
 * - Editable display name
 * - Data management (export, reset)
 * - App info and version
 *
 * Privacy-first design:
 * - No email, phone, or personal data is collected
 * - User ID is a random UUID shown only for reference
 * - All data is stored locally on the device
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { COLORS } from "../theme/colors";
import { UserAccount } from "../types";
import {
  getOrCreateUser,
  updateDisplayName,
  deleteAccount,
} from "../storage/userStorage";
import { clearAllData } from "../storage/debtStorage";

const ProfileScreen: React.FC = () => {
  /** Current user account state */
  const [user, setUser] = useState<UserAccount | null>(null);

  /** Editable display name (local state before saving) */
  const [editName, setEditName] = useState("");

  /** Whether the name input is in edit mode */
  const [isEditing, setIsEditing] = useState(false);

  /** Load user on mount */
  useEffect(() => {
    const load = async () => {
      const u = await getOrCreateUser();
      setUser(u);
      setEditName(u.displayName);
    };
    load();
  }, []);

  /**
   * Saves the updated display name to storage.
   * Trims whitespace and falls back to "Buddy" if empty.
   */
  const handleSaveName = useCallback(async () => {
    const updated = await updateDisplayName(editName);
    setUser(updated);
    setIsEditing(false);
  }, [editName]);

  /**
   * Resets all app data after user confirmation.
   * Clears debts, payments, and user account.
   * Creates a fresh anonymous account immediately after.
   */
  const handleResetData = useCallback(() => {
    Alert.alert(
      "Reset All Data",
      "This will permanently delete all your debts, payments, and account data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            await deleteAccount();
            const freshUser = await getOrCreateUser();
            setUser(freshUser);
            setEditName(freshUser.displayName);
          },
        },
      ]
    );
  }, []);

  if (!user) return null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* ── Header ── */}
      <View style={styles.titleSection}>
        <Text style={styles.appLabel}>BUDGETBUDDY</Text>
        <Text style={styles.screenTitle}>Profile</Text>
        <Text style={styles.screenSubtitle}>
          Your anonymous account settings.
        </Text>
      </View>

      {/* ── Avatar + Name Card ── */}
      <View style={styles.profileCard}>
        {/* Avatar circle with first letter */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Display name (editable) */}
        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.nameInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter name..."
              placeholderTextColor={COLORS.textMuted}
              autoFocus
              onSubmitEditing={handleSaveName}
              maxLength={20}
            />
            <TouchableOpacity onPress={handleSaveName} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.editHint}>Tap to edit</Text>
          </TouchableOpacity>
        )}

        {/* Anonymous ID badge */}
        <View style={styles.idBadge}>
          <Text style={styles.idLabel}>ANONYMOUS ID</Text>
          <Text style={styles.idValue}>
            {user.id.substring(0, 8)}...{user.id.substring(user.id.length - 4)}
          </Text>
        </View>
      </View>

      {/* ── Privacy Info Card ── */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔒 Privacy First</Text>
        <Text style={styles.infoText}>
          BudgetBuddy does not collect your email, phone number, or any
          personal information. Your data is stored locally on this device
          and is never sent to any server.
        </Text>
      </View>

      {/* ── Settings Section ── */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>DATA MANAGEMENT</Text>

        <TouchableOpacity style={styles.settingsRow}>
          <Text style={styles.settingsRowText}>Export My Data</Text>
          <Text style={styles.settingsRowArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsRow, styles.dangerRow]}
          onPress={handleResetData}
        >
          <Text style={[styles.settingsRowText, { color: COLORS.danger }]}>
            Reset All Data
          </Text>
          <Text style={[styles.settingsRowArrow, { color: COLORS.danger }]}>
            →
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── App Info ── */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>BudgetBuddy v1.0.0</Text>
        <Text style={styles.appInfoText}>Built with React Native + Expo</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  titleSection: {
    paddingTop: 56,
    paddingBottom: 20,
  },
  appLabel: {
    fontSize: 12,
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  editHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 16,
    minWidth: 160,
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveBtnText: {
    color: COLORS.bg,
    fontWeight: "700",
    fontSize: 14,
  },
  idBadge: {
    marginTop: 20,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  idLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  idValue: {
    fontSize: 13,
    color: COLORS.textDim,
    fontVariant: ["tabular-nums"],
  },

  /* Privacy Info */
  infoCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: `${COLORS.success}20`,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textDim,
    lineHeight: 19,
  },

  /* Settings */
  settingsSection: {
    marginTop: 24,
  },
  settingsSectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  settingsRow: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dangerRow: {
    borderColor: `${COLORS.danger}20`,
  },
  settingsRowText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  settingsRowArrow: {
    fontSize: 16,
    color: COLORS.textDim,
  },

  /* App Info */
  appInfo: {
    alignItems: "center",
    marginTop: 32,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default ProfileScreen;
