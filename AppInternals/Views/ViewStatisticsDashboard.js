import React from "react";

import {
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ViewModelStatisticsDashboard from "../ViewModels/ViewModelStatisticsDashboard";

const screenWidth = Dimensions.get("window").width;

const color1 = "#c49572";
const color3 = "#876146";
const color6 = "#f7d9b7";
const brownColor = "#2a1902";
const inputBoxColor = "#F3E4C9";

export default function ViewStatisticsDashboard({ navigation }) {
    const {
        selectedPeriod,
        dashboardData,
        isLoadingStatistics,
        statisticsError,
        changeSelectedPeriod,
        refreshStatistics,
    } = ViewModelStatisticsDashboard();

    const periodOrder = ["day", "week", "month", "year"];

    if (isLoadingStatistics) {
        return (
            <ImageBackground
            source={require("../../assets/background.jpg")}
            style={styles.background}
            resizeMode="cover"
            >
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>Loading statistics...</Text>
                </View>
            </ImageBackground>
        );
    }

    if (statisticsError) {
        return (
            <ImageBackground
            source={require("../../assets/background.jpg")}
            style={styles.background}
            resizeMode="cover"
            >
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{statisticsError}</Text>

                    <TouchableOpacity style={styles.refreshButton} onPress={refreshStatistics}>
                    <Text style={styles.refreshButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    const selectedPeriodData = dashboardData?.periods?.[selectedPeriod];

    return (
        <ImageBackground
            source={require("../../assets/background.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                    <View style={styles.topBar}>
                    <Text style={styles.heading}>Stats</Text>

                    <TouchableOpacity style={styles.userIcon}>
                        <Text style={styles.userIconText}>👤</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentScroll}
                showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.pageTitle}>Statistics Dashboard</Text>
                    <Text style={styles.pageSubtitle}>
                        Track your focus sessions and study progress.
                    </Text>

                    <View style={styles.summaryGrid}>
                        <SummaryCard
                        title="Total Sessions"
                        value={dashboardData?.totalSessions || 0}
                        />

                        <SummaryCard
                        title="Current Streak"
                        value={`${dashboardData?.currentStreak || 0} days`}
                        />

                        <SummaryCard
                        title="Total Study Time"
                        value={dashboardData?.totalStudyHoursLabel || "0h"}
                        />

                        <SummaryCard
                        title="Selected Period"
                        value={selectedPeriodData?.periodStudyHoursLabel || "0h"}
                        caption={`${selectedPeriodData?.periodSessionCount || 0} sessions`}
                        />
                    </View>

                    <View style={styles.periodSelector}>
                        {periodOrder.map((period) => (
                            <TouchableOpacity
                                key={period}
                                style={[
                                    styles.periodButton,
                                    selectedPeriod === period && styles.periodButtonSelected,
                                ]}
                                onPress={() => changeSelectedPeriod(period)}
                                >
                                    <Text
                                        style={[
                                        styles.periodButtonText,
                                        selectedPeriod === period && styles.periodButtonTextSelected,
                                        ]}
                                    >
                                        {getPeriodButtonLabel(period)}
                                    </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Study Time Charts</Text>
                    <Text style={styles.sectionHint}>
                        Scroll sideways to compare today, this week, this month, and this year.
                    </Text>

                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chartScrollContent}
                    >
                        {periodOrder.map((period) => {
                            const periodData = dashboardData?.periods?.[period];

                        return (
                            <TouchableOpacity
                            activeOpacity={0.9}
                            key={period}
                            onPress={() => changeSelectedPeriod(period)}
                            style={[
                                styles.chartCard,
                                selectedPeriod === period && styles.chartCardSelected,
                            ]}
                            >
                                <View style={styles.chartHeader}>
                                    <View>
                                        <Text style={styles.chartTitle}>{periodData?.title}</Text>
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

                                <BarChart buckets={periodData?.buckets || []} />
                            </TouchableOpacity>
                        );
                    })}

                    </ScrollView>
                    <View style={styles.selectedDetailsCard }>
                            <Text style={styles.selectedDetailsTitle}>
                                {selectedPeriodData?.title} Summary
                            </Text>

                            <Text style={styles.selectedDetailsText}>
                                Study time: {selectedPeriodData?.periodStudyHoursLabel || "0h"}
                            </Text>

                            <Text style={styles.selectedDetailsText}>
                                Sessions: {selectedPeriodData?.periodSessionCount||  0}
                            </Text>
                        </View>
                </ScrollView>

                <View style={styles.navBar}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigation.navigate("Home")}
                    >
                        <Text style={styles.navText}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigation.navigate("ToDo")}
                    >
                        <Text style={styles.navText}>Tasks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navText}>Stats</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigation.navigate("AppBlock")}
                    >
                        <Text style={styles.navText}>App Blocking</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

function SummaryCard({ title, value, caption }) {
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{title}</Text>
            <Text style={styles.summaryValue}>{value}</Text>

            {caption ? <Text style={styles.summaryCaption}>{caption}</Text> : null}
        </View>
    );
}

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
                    bucket.seconds > 0 ? Math.max(6, Math.round((bucket.percentage / 100) * 130)): 0;

                    return (
                        <View key={bucket.label} style={styles.barGroup}>
                            <Text style={styles.barValue}>{bucket.hoursLabel}</Text>

                            <View style={styles.barOuter}>
                                <View
                                style={[
                                    styles.barInner,
                                    {height: barFillHeight,},
                                ]}
                                />
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
    if (period === "day") {
        return "Day";
    }

    if (period === "week") {
        return "Week";
    }

    if (period === "month") {
        return "Month";
    }
        return "Year";
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    container: {
    flex: 1,
        backgroundColor: "transparent",
        justifyContent: "space-between",
    },

    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 55,
        paddingBottom: 10,
    },

    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: brownColor,
    },

    heading: {
        fontSize: 28,
        fontWeight: "bold",
        color: brownColor,
        marginLeft: 145,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

    userIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: color1,
        justifyContent: "center",
        alignItems: "center",
    },

    userIconText: {
        fontSize: 20,
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    contentScroll: {
        paddingBottom: 120,
    },

    centerContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: brownColor,
        fontWeight: "600",
    },

    errorText: {
        fontSize: 16,
        color: "#B00020",
        marginBottom: 14,
        textAlign: "center",
        fontWeight: "700",
    },

    refreshButton: {
        backgroundColor: color3,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 18,
    },

    refreshButtonText: {
        color: color6,
        fontWeight: "700",
    },

    pageTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: brownColor,
    },

    pageSubtitle: {
        fontSize: 14,
        color: brownColor,
        marginTop: 4,
        marginBottom: 18,
        fontWeight: "600",
    },

    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    summaryCard: {
        width: "48%",
        backgroundColor: color1,
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    summaryTitle: {
        fontSize: 13,
        color: "#040607",
        fontWeight: "600",
        textAlign: "center",
    },

    summaryValue: {
        fontSize: 21,
        color: brownColor,
        fontWeight: "bold",
        marginTop: 6,
        textAlign: "center",
    },

    summaryCaption: {
        fontSize: 12,
        color: brownColor,
        marginTop: 4,
        fontWeight: "600",
        textAlign: "center",
    },

    periodSelector: {
        flexDirection: "row",
        backgroundColor: inputBoxColor,
        borderRadius: 18,
        padding: 5,
        marginBottom: 20,
    },

    periodButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: "center",
    },

    periodButtonSelected: {
        backgroundColor: color3,
    },

    periodButtonText: {
        color: brownColor,
        fontWeight: "700",
        fontSize: 13,
    },

    periodButtonTextSelected: {
        color: color6,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: brownColor,
    },

    sectionHint: {
        fontSize: 13,
        color: brownColor,
        marginTop: 3,
        marginBottom: 12,
        fontWeight: "600",
    },

    chartScrollContent: {
        paddingRight: 18,
    },

    chartCard: {
        width: screenWidth * 0.85,
        backgroundColor: inputBoxColor,
        borderRadius: 22,
        padding: 16,
        marginRight: 14,
        borderWidth: 2,
        borderColor: "transparent",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    chartCardSelected: {
        
    },

    chartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14,
    },

    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: brownColor,
    },

    chartSubtitle: {
        fontSize: 13,
        color: brownColor,
        marginTop: 2,
        fontWeight: "600",
    },

    sessionPill: {
        backgroundColor: color1,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
    },

    sessionPillText: {
        fontSize: 11,
        color: brownColor,
        fontWeight: "700",
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
        color: brownColor,
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
        color: brownColor,
        marginBottom: 5,
        fontWeight: "700",
    },

    barOuter: {
        width: 24,
        height: 130,
        borderRadius: 12,
        backgroundColor: color6,
        overflow: "hidden",
        justifyContent: "flex-end",
    },

    barInner: {
        width: "100%",
        backgroundColor: color3,
        borderRadius: 12,
    },

    barLabel: {
        marginTop: 8,
        fontSize: 10,
        color: brownColor,
        fontWeight: "700",
        textAlign: "center",
    },

    selectedDetailsCard: {
        marginTop: 18,
        backgroundColor: color3,
        borderRadius: 18,
        padding: 16,
    },

    selectedDetailsTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: color6,
        marginBottom: 8,
    },

    selectedDetailsText: {
        fontSize: 14,
        color: color6,
        marginBottom: 4,
        fontWeight: "600",
    },

    navBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: color3,
        paddingVertical: 20,

        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    navButton: {
        alignItems: "center",
    },

    navText: {
        fontSize: 14,
        fontWeight: "600",
        color: brownColor,
    },
});