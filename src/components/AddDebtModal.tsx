/**
 * BudgetBuddy — AddDebtModal Component
 * File: src/components/AddDebtModal.tsx
 *
 * A full-screen modal that presents a form for adding a new debt.
 * Collects: debt name, total balance, APR, and minimum monthly payment.
 *
 * Design notes:
 * - Uses a dark overlay with blur-style backdrop
 * - Form validates all fields before enabling the submit button
 * - Keyboard-aware: uses decimal-pad for number fields
 * - Calls onAdd callback with a complete NewDebtInput object
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NewDebtInput } from "../types";

/* ─── Color Constants ─── */
const COLORS = {
  bg: "#0a0e1a",
  card: "#131829",
  cardBorder: "#1e2642",
  accent: "#6c5ce7",
  accentGlow: "rgba(108, 92, 231, 0.3)",
  text: "#e8eaf6",
  textDim: "#7986cb",
  textMuted: "#3d4566",
  white: "#ffffff",
} as const;

/* ─── Props Interface ─── */
interface AddDebtModalProps {
  /** Whether the modal is currently visible */
  visible: boolean;

  /** Callback to close the modal */
  onClose: () => void;

  /** Callback when user submits a valid debt — receives the form data */
  onAdd: (debt: NewDebtInput) => void;
}

/* ─── Component ─── */
const AddDebtModal: React.FC<AddDebtModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  /** Form field state */
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState("");
  const [minPayment, setMinPayment] = useState("");

  /**
   * Validates and submits the form.
   * Parses string inputs to numbers, checks all are valid,
   * then calls onAdd and resets the form.
   */
  const handleSubmit = useCallback(() => {
    const balanceNum = parseFloat(balance);
    const rateNum = parseFloat(rate);
    const paymentNum = parseFloat(minPayment);

    /* Validate: all fields must be filled and positive */
    if (!name.trim()) return;
    if (isNaN(balanceNum) || balanceNum <= 0) return;
    if (isNaN(rateNum) || rateNum < 0) return;
    if (isNaN(paymentNum) || paymentNum <= 0) return;

    onAdd({
      name: name.trim(),
      balance: balanceNum,
      originalBalance: balanceNum,
      rate: rateNum,
      minPayment: paymentNum,
    });

    /* Reset form fields */
    setName("");
    setBalance("");
    setRate("");
    setMinPayment("");
  }, [name, balance, rate, minPayment, onAdd]);

  /** Check if form is valid (for button state) */
  const isValid =
    name.trim().length > 0 &&
    parseFloat(balance) > 0 &&
    parseFloat(rate) >= 0 &&
    parseFloat(minPayment) > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Header ── */}
            <Text style={styles.title}>Add New Debt</Text>
            <Text style={styles.subtitle}>
              Enter the details of the debt you want to track.
            </Text>

            {/* ── Form Fields ── */}
            <View style={styles.fieldGroup}>
              {/* Debt Name */}
              <View style={styles.field}>
                <Text style={styles.label}>DEBT NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Chase Visa"
                  placeholderTextColor={COLORS.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              {/* Total Balance */}
              <View style={styles.field}>
                <Text style={styles.label}>TOTAL BALANCE ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5000.00"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="decimal-pad"
                  value={balance}
                  onChangeText={setBalance}
                  returnKeyType="next"
                />
              </View>

              {/* APR and Min Payment — side by side */}
              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>APR (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="19.9"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="decimal-pad"
                    value={rate}
                    onChangeText={setRate}
                    returnKeyType="next"
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>MIN PAYMENT ($)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="150"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="decimal-pad"
                    value={minPayment}
                    onChangeText={setMinPayment}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
              </View>
            </View>

            {/* ── Action Buttons ── */}
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.addButton,
                  !isValid && styles.addButtonDisabled,
                ]}
                disabled={!isValid}
              >
                <Text style={styles.addButtonText}>Add Debt</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/* ─── Styles ─── */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderBottomWidth: 0,
    maxHeight: "80%",
  },

  /* Header */
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDim,
    marginBottom: 24,
  },

  /* Form */
  fieldGroup: {
    gap: 16,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: COLORS.textDim,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },

  /* Buttons */
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.textDim,
    fontSize: 15,
    fontWeight: "600",
  },
  addButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});

export default React.memo(AddDebtModal);
