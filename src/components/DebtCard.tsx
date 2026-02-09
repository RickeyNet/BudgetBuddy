/**
 * BudgetBuddy — DebtCard Component
 * File: src/components/DebtCard.tsx
 *
 * Displays a single debt entry as an interactive card.
 * Shows: name, remaining balance, paid amount, APR, progress ring,
 * payoff timeline, and action buttons (make payment / delete).
 *
 * Features:
 * - Animated progress ring color-coded by payoff percentage
 * - Inline payment input (collapsible)
 * - Status badges (Almost there / Making progress / Keep going)
 * - Estimated months to payoff
 *
 * Performance: Uses React.memo to prevent unnecessary re-renders
 * when sibling debt cards update.
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Debt } from "../types";
import { calcMonthsToPayoff, formatCurrency } from "../utils/calculations";
import ProgressRing from "./ProgressRing";

/* ─── Color Constants ─── */
const COLORS = {
  card: "#131829",
  cardBorder: "#1e2642",
  accent: "#6c5ce7",
  success: "#00e676",
  successDim: "rgba(0, 230, 118, 0.15)",
  warning: "#ffc107",
  warningDim: "rgba(255, 193, 7, 0.15)",
  danger: "#ff5252",
  dangerDim: "rgba(255, 82, 82, 0.15)",
  text: "#e8eaf6",
  textDim: "#7986cb",
  textMuted: "#3d4566",
  bg: "#0a0e1a",
  white: "#ffffff",
} as const;

/* ─── Props Interface ─── */
interface DebtCardProps {
  /** The debt data to display */
  debt: Debt;

  /** Callback when user submits a payment — receives (debtId, amount) */
  onPayment: (debtId: string, amount: number) => void;

  /** Callback when user deletes this debt — receives debtId */
  onDelete: (debtId: string) => void;
}

/* ─── Component ─── */
const DebtCard: React.FC<DebtCardProps> = ({ debt, onPayment, onDelete }) => {
  /** Local state for the payment input visibility and value */
  const [showPayInput, setShowPayInput] = useState(false);
  const [payAmount, setPayAmount] = useState("");

  /** Derived calculations */
  const percentPaid =
    ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100;

  const monthsLeft = calcMonthsToPayoff(
    debt.balance,
    debt.rate,
    debt.minPayment
  );

  /** Color coding based on progress */
  const ringColor =
    percentPaid >= 75
      ? COLORS.success
      : percentPaid >= 40
      ? COLORS.warning
      : COLORS.accent;

  const statusBg =
    percentPaid >= 75
      ? COLORS.successDim
      : percentPaid >= 40
      ? COLORS.warningDim
      : COLORS.dangerDim;

  const statusText =
    percentPaid >= 75
      ? "Almost there!"
      : percentPaid >= 40
      ? "Making progress"
      : "Keep going";

  /**
   * Handles payment submission.
   * Validates the amount is positive and doesn't exceed the balance.
   * Uses useCallback to prevent child re-renders.
   */
  const handlePayment = useCallback(() => {
    const amount = parseFloat(payAmount);
    if (amount > 0 && amount <= debt.balance) {
      onPayment(debt.id, amount);
      setPayAmount("");
      setShowPayInput(false);
    }
  }, [payAmount, debt.id, debt.balance, onPayment]);

  return (
    <View style={styles.card}>
      {/* ── Header: Name + Status Badge + Progress Ring ── */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.nameRow}>
            <Text style={styles.debtName}>{debt.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusText, { color: ringColor }]}>
                {statusText}
              </Text>
            </View>
          </View>
          <Text style={styles.rateText}>
            {debt.rate}% APR · {formatCurrency(debt.minPayment)}/mo minimum
          </Text>
        </View>

        {/* Progress Ring with percent label */}
        <View style={styles.ringContainer}>
          <ProgressRing percent={percentPaid} color={ringColor} />
          <Text style={[styles.ringLabel, { color: ringColor }]}>
            {percentPaid.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* ── Balance Row: Remaining vs Paid ── */}
      <View style={styles.balanceRow}>
        <View>
          <Text style={styles.balanceLabel}>REMAINING</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(debt.balance)}
          </Text>
        </View>
        <View style={styles.balanceRight}>
          <Text style={styles.balanceLabel}>PAID OFF</Text>
          <Text style={[styles.balanceAmount, { color: COLORS.success }]}>
            {formatCurrency(debt.originalBalance - debt.balance)}
          </Text>
        </View>
      </View>

      {/* ── Progress Bar ── */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentPaid}%`,
              backgroundColor: ringColor,
            },
          ]}
        />
      </View>

      {/* ── Footer: Timeline + Action Buttons ── */}
      <View style={styles.footerRow}>
        <Text style={styles.timelineText}>
          {monthsLeft === Infinity
            ? "⚠ Payment too low"
            : `~${monthsLeft} months to payoff`}
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => setShowPayInput(!showPayInput)}
            style={[
              styles.payButton,
              showPayInput && { backgroundColor: COLORS.cardBorder },
            ]}
          >
            <Text style={styles.payButtonText}>
              {showPayInput ? "Cancel" : "💸 Pay"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(debt.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Inline Payment Input (collapsible) ── */}
      {showPayInput && (
        <View style={styles.payInputRow}>
          <TextInput
            style={styles.payInput}
            placeholder="Enter amount..."
            placeholderTextColor={COLORS.textMuted}
            keyboardType="decimal-pad"
            value={payAmount}
            onChangeText={setPayAmount}
            onSubmitEditing={handlePayment}
          />
          <TouchableOpacity
            onPress={handlePayment}
            style={styles.confirmPayButton}
          >
            <Text style={styles.confirmPayText}>Pay</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/* ─── Styles ─── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  debtName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  rateText: {
    fontSize: 13,
    color: COLORS.textDim,
  },

  /* Progress Ring */
  ringContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  ringLabel: {
    position: "absolute",
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  /* Balance Row */
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  balanceRight: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },

  /* Progress Bar */
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.cardBorder,
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  /* Footer */
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  timelineText: {
    fontSize: 12,
    color: COLORS.textDim,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  payButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: COLORS.dangerDim,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 12,
  },

  /* Payment Input */
  payInputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  payInput: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.text,
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  confirmPayButton: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  confirmPayText: {
    color: COLORS.bg,
    fontWeight: "700",
    fontSize: 14,
  },
});

export default React.memo(DebtCard);
