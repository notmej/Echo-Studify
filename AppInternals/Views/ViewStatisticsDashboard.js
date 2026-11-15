import React, { useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";

import ViewModelStatisticsDashboard from "../ViewModels/ViewModelStatisticsDashboard";

const screenWidth = Dimensions.get("window").width;

const theme = {
  background: "#091B15",
  surface: "#102820",
  surfaceRaised: "#19362C",
  surfaceSelected: "#21513F",
  emerald: "#28765A",
  ivory: "#F3EFE2",
  muted: "#B6C8BE",
  gold: "#C3A777",
  outline: "#315143",
  overlay: "rgba(4, 18, 13, 0.8)",
  danger: "#E4A9A1",
};

const periodOrder = ["day", "week", "month", "year"];
const chartWidth = screenWidth * 0.83;
const chartGap = 14;

export default function ViewStatisticsDashboard({ navigation }) {
  const {
    selectedPeriod,
    dashboardData,
    isLoadingStatistics,
    statisticsError,
    changeSelectedPeriod,
    refreshStatistics,
  } = ViewModelStatisticsDashboard();

  const chartScrollRef = useRef(null);

  // Selecting a period also scrolls to the corresponding chart.
  const selectPeriod = (period) => {
    changeSelectedPeriod(period);

    const index = periodOrder.indexOf(period);

    if (index !== -1) {
      chartScrollRef.current?.scrollTo({
        x: index * (chartWidth + chartGap),
        animated: true,
      });
    }
  };

  if (isLoadingStatistics) {
    return (
      <ImageBackground
        source={require("../../assets/25_00.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />

        <View style={[styles.centerContent, styles.backgroundOverlay]}>
          <ActivityIndicator size="large" color={theme.gold} />
          <Text style={styles.loadingText}>Loading your statistics...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (statisticsError) {
    return (
      <ImageBackground
        source={require("../../assets/25_00.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />

        <View style={[styles.centerContent, styles.backgroundOverlay]}>
          <View style={styles.errorCard}>
            <Text style={styles.errorEyebrow}>SOMETHING WENT WRONG</Text>

            <Text style={styles.errorTitle}>Unable to load statistics</Text>

            <Text style={styles.errorText}>{statisticsError}</Text>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refreshStatistics}
              activeOpacity={0.8}
            >
              <Text style={styles.refreshButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  const selectedPeriodData = dashboardData?.periods?.[selectedPeriod];

  return (
    <ImageBackground
      source={require("../../assets/25_00.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      <View style={styles.backgroundOverlay}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.brandEyebrow}>YOUR STUDY SPACE</Text>

              <Text style={styles.brandText}>
                Studify<Text style={styles.logoDot}>.</Text>
              </Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.headerBadge}>
                <View style={styles.headerBadgeDot} />

                <Text style={styles.headerBadgeText}>PROGRESS</Text>
              </View>

              <TouchableOpacity
                style={styles.aboutIcon}
                onPress={() => navigation.navigate("About")}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="About Studify and help"
              >
                <Text style={styles.aboutIconText}>?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MAIN CONTENT */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* PAGE INTRO */}
            <View style={styles.introSection}>
              <Text style={styles.pageEyebrow}>YOUR PROGRESS</Text>

              <Text style={styles.pageTitle}>The bigger picture.</Text>

              <Text style={styles.pageSubtitle}>
                Every focused minute adds up.
              </Text>
            </View>

            {/* SUMMARY HEADER */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>OVERVIEW</Text>

                <Text style={styles.sectionTitle}>At a glance</Text>
              </View>

              <View style={styles.sectionDecoration} />
            </View>

            {/* SUMMARY GRID */}
            <View style={styles.summaryGrid}>
              <SummaryCard
                title="Total Sessions"
                value={dashboardData?.totalSessions || 0}
                icon="◷"
              />

              <SummaryCard
                title="Current Streak"
                value={`${dashboardData?.currentStreak || 0} days`}
                icon="✦"
              />

              <SummaryCard
                title="Total Study Time"
                value={dashboardData?.totalStudyHoursLabel || "0h"}
                icon="◉"
              />

              <SummaryCard
                title="Selected Period"
                value={selectedPeriodData?.periodStudyHoursLabel || "0h"}
                caption={`${selectedPeriodData?.periodSessionCount || 0} sessions`}
                icon="▥"
                featured
              />
            </View>

            {/* PERIOD SELECTOR */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>TIMEFRAME</Text>

                <Text style={styles.sectionTitle}>Explore your focus</Text>
              </View>
            </View>

            <View style={styles.periodSelector}>
              {periodOrder.map((period) => {
                const active = selectedPeriod === period;

                return (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodButton,
                      active && styles.periodButtonSelected,
                    ]}
                    onPress={() => selectPeriod(period)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        active && styles.periodButtonTextSelected,
                      ]}
                    >
                      {getPeriodButtonLabel(period)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* CHARTS */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>STUDY ANALYTICS</Text>

                <Text style={styles.sectionTitle}>Study time</Text>
              </View>
            </View>

            <Text style={styles.sectionHint}>
              Swipe across to explore your study activity.
            </Text>

            <ScrollView
              ref={chartScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chartScrollContent}
            >
              {periodOrder.map((period) => {
                const periodData = dashboardData?.periods?.[period];

                const active = selectedPeriod === period;

                return (
                  <TouchableOpacity
                    key={period}
                    activeOpacity={0.9}
                    onPress={() => selectPeriod(period)}
                    style={[
                      styles.chartCard,
                      active && styles.chartCardSelected,
                    ]}
                  >
                    <View style={styles.chartHeader}>
                      <View style={styles.chartHeaderText}>
                        <Text style={styles.chartEyebrow}>
                          {active ? "SELECTED PERIOD" : "STUDY ACTIVITY"}
                        </Text>

                        <Text style={styles.chartTitle}>
                          {periodData?.title}
                        </Text>

                        <Text style={styles.chartSubtitle}>
                          {periodData?.periodStudyHoursLabel || "0h"} total
                        </Text>
                      </View>

                      <View style={styles.sessionPill}>
                        <Text style={styles.sessionPillText}>
                          {periodData?.periodSessionCount || 0} sessions
                        </Text>
                      </View>
                    </View>

                    <View style={styles.chartDivider} />

                    <BarChart buckets={periodData?.buckets || []} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* SELECTED PERIOD SUMMARY */}
            <View style={styles.detailsCard}>
              <View style={styles.detailsHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>PERIOD BREAKDOWN</Text>

                  <Text style={styles.detailsTitle}>
                    {selectedPeriodData?.title} Summary
                  </Text>
                </View>

                <Text style={styles.detailsIcon}>✦</Text>
              </View>

              <View style={styles.detailsDivider} />

              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Study time</Text>

                <Text style={styles.detailsValue}>
                  {selectedPeriodData?.periodStudyHoursLabel || "0h"}
                </Text>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Sessions completed</Text>

                <Text style={styles.detailsValue}>
                  {selectedPeriodData?.periodSessionCount || 0}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* BOTTOM NAVIGATION */}
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.navIcon}>⌂</Text>
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("ToDo")}
            >
              <Text style={styles.navIcon}>☷</Text>
              <Text style={styles.navText}>Tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <Text style={[styles.navIcon, styles.navIconActive]}>▥</Text>

              <Text style={[styles.navText, styles.navTextActive]}>Stats</Text>

              <View style={styles.activeIndicator} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("AppBlock")}
            >
              <Text style={styles.navIcon}>⊘</Text>
              <Text style={styles.navText}>Blocking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

// SUMMARY CARD
function SummaryCard({ title, value, caption, icon, featured = false }) {
  return (
    <View style={[styles.summaryCard, featured && styles.summaryCardFeatured]}>
      <View style={styles.summaryCardTop}>
        <Text style={styles.summaryIcon}>{icon}</Text>

        <View style={styles.summaryAccentDot} />
      </View>

      <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>

      <Text style={styles.summaryTitle}>{title}</Text>

      {caption ? <Text style={styles.summaryCaption}>{caption}</Text> : null}
    </View>
  );
}

// BAR CHART
function BarChart({ buckets }) {
  return (
    <View style={styles.chartArea}>
      <View style={styles.yAxisLabels}>
        <Text style={styles.axisText}>100%</Text>
        <Text style={styles.axisText}>50%</Text>
        <Text style={styles.axisText}>0%</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.innerBarScroll}
      >
        {buckets.map((bucket) => {
          const barFillHeight =
            bucket.seconds > 0
              ? Math.max(6, Math.round((bucket.percentage / 100) * 130))
              : 0;

          return (
            <View key={bucket.label} style={styles.barGroup}>
              <Text style={styles.barValue}>{bucket.hoursLabel}</Text>

              <View style={styles.barOuter}>
                <View style={[styles.barInner, { height: barFillHeight }]} />
              </View>

              <Text style={styles.barLabel}>{bucket.label}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function getPeriodButtonLabel(period) {
  if (period === "day") return "Day";
  if (period === "week") return "Week";
  if (period === "month") return "Month";
  return "Year";
}

const styles = StyleSheet.create({
  // BACKGROUND
  background: {
    flex: 1,
    backgroundColor: theme.background,
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
  },

  container: {
    flex: 1,
  },

  // HEADER
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 18,
  },

  brandEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.gold,
    letterSpacing: 2,
    marginBottom: 5,
  },

  brandText: {
    fontSize: 27,
    fontWeight: "800",
    color: theme.ivory,
    letterSpacing: -0.8,
  },

  logoDot: {
    color: theme.gold,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 12,
  },

  headerBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.gold,
    marginRight: 6,
  },

  headerBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: theme.muted,
  },

  aboutIcon: {
    width: 41,
    height: 41,
    borderRadius: 21,
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.gold,
    justifyContent: "center",
    alignItems: "center",
  },

  aboutIconText: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.gold,
  },

  // CONTENT
  content: {
    flex: 1,
  },

  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  introSection: {
    marginBottom: 26,
    paddingHorizontal: 4,
  },

  pageEyebrow: {
    color: theme.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 9,
  },

  pageTitle: {
    fontSize: 29,
    fontWeight: "700",
    color: theme.ivory,
    letterSpacing: -0.7,
    marginBottom: 6,
  },

  pageSubtitle: {
    color: theme.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  // SECTIONS
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 15,
    paddingHorizontal: 4,
  },

  sectionEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.gold,
    letterSpacing: 1.6,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: theme.ivory,
    marginTop: 5,
    letterSpacing: -0.4,
  },

  sectionDecoration: {
    width: 22,
    height: 2,
    backgroundColor: theme.gold,
    borderRadius: 2,
    marginBottom: 5,
  },

  // SUMMARY CARDS
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  summaryCard: {
    width: "48%",
    minHeight: 150,
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  summaryCardFeatured: {
    backgroundColor: theme.surfaceSelected,
    borderColor: theme.gold,
  },

  summaryCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  summaryIcon: {
    fontSize: 21,
    color: theme.gold,
  },

  summaryAccentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.emerald,
  },

  summaryValue: {
    fontSize: 29,
    fontWeight: "800",
    color: theme.ivory,
    letterSpacing: -0.8,
  },

  summaryTitle: {
    fontSize: 12,
    color: theme.muted,
    fontWeight: "600",
    marginTop: 6,
  },

  summaryCaption: {
    fontSize: 11,
    color: theme.gold,
    fontWeight: "600",
    marginTop: 5,
  },

  // PERIOD SELECTOR
  periodSelector: {
    flexDirection: "row",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 5,
    marginBottom: 29,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  periodButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },

  periodButtonSelected: {
    backgroundColor: theme.emerald,
  },

  periodButtonText: {
    color: theme.muted,
    fontWeight: "700",
    fontSize: 13,
  },

  periodButtonTextSelected: {
    color: theme.ivory,
  },

  // CHARTS
  sectionHint: {
    color: theme.muted,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 15,
    paddingHorizontal: 4,
  },

  chartScrollContent: {
    paddingRight: 20,
    paddingBottom: 6,
  },

  chartCard: {
    width: chartWidth,
    backgroundColor: theme.surface,
    borderRadius: 22,
    padding: 18,
    marginRight: chartGap,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  chartCardSelected: {
    backgroundColor: theme.surfaceRaised,
    borderColor: theme.gold,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  chartHeaderText: {
    flex: 1,
    paddingRight: 8,
  },

  chartEyebrow: {
    fontSize: 9,
    color: theme.gold,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 7,
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.ivory,
  },

  chartSubtitle: {
    fontSize: 13,
    color: theme.muted,
    marginTop: 5,
  },

  sessionPill: {
    backgroundColor: theme.surfaceSelected,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  sessionPillText: {
    fontSize: 10,
    color: theme.ivory,
    fontWeight: "700",
  },

  chartDivider: {
    height: 1,
    backgroundColor: theme.outline,
    marginBottom: 17,
  },

  chartArea: {
    flexDirection: "row",
    height: 205,
  },

  yAxisLabels: {
    width: 42,
    height: 160,
    justifyContent: "space-between",
    paddingVertical: 2,
    marginTop: 18,
  },

  axisText: {
    fontSize: 10,
    color: theme.muted,
    fontWeight: "600",
  },

  innerBarScroll: {
    alignItems: "flex-end",
    paddingRight: 8,
  },

  barGroup: {
    width: 48,
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 4,
  },

  barValue: {
    fontSize: 10,
    color: theme.ivory,
    marginBottom: 6,
    fontWeight: "700",
  },

  barOuter: {
    width: 24,
    height: 130,
    borderRadius: 12,
    backgroundColor: theme.surfaceSelected,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  barInner: {
    width: "100%",
    backgroundColor: theme.emerald,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.gold,
  },

  barLabel: {
    marginTop: 8,
    fontSize: 10,
    color: theme.muted,
    fontWeight: "700",
    textAlign: "center",
  },

  // SELECTED PERIOD DETAILS
  detailsCard: {
    marginTop: 21,
    backgroundColor: theme.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.outline,
    marginBottom: 15,
  },

  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailsTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.ivory,
    marginTop: 6,
  },

  detailsIcon: {
    fontSize: 24,
    color: theme.gold,
  },

  detailsDivider: {
    height: 1,
    backgroundColor: theme.outline,
    marginVertical: 17,
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  detailsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.muted,
  },

  detailsValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.ivory,
  },

  // LOADING AND ERROR
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingText: {
    color: theme.ivory,
    fontSize: 15,
    marginTop: 15,
    fontWeight: "600",
  },

  errorCard: {
    width: "100%",
    backgroundColor: theme.surface,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.outline,
    alignItems: "center",
  },

  errorEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.danger,
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.ivory,
    textAlign: "center",
  },

  errorText: {
    fontSize: 13,
    color: theme.muted,
    textAlign: "center",
    marginVertical: 14,
    lineHeight: 20,
  },

  refreshButton: {
    backgroundColor: theme.emerald,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 8,
  },

  refreshButtonText: {
    color: theme.ivory,
    fontWeight: "700",
  },

  // NAVIGATION
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.outline,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  navButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 48,
  },

  navIcon: {
    fontSize: 22,
    color: theme.muted,
    marginBottom: 4,
  },

  navIconActive: {
    color: theme.gold,
  },

  navText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.muted,
  },

  navTextActive: {
    color: theme.ivory,
    fontWeight: "800",
  },

  activeIndicator: {
    position: "absolute",
    top: -12,
    width: 24,
    height: 2,
    borderRadius: 2,
    backgroundColor: theme.gold,
  },
});
