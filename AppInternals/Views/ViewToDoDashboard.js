import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
} from "react-native";

import ViewModelToDoDashboard from "../ViewModels/ViewModelToDoDashboard";
import TaskCategoryComponent from "../Components/TaskAndEnergyCategoryComponent";

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
  overlay: "rgba(4, 18, 13, 0.55)",
  danger: "#D58C83",
};

export default function ViewToDoDashboard({ navigation }) {
  const {
    displayedTaskList,

    taskInput,
    setTaskInput,
    taskDescription,
    setTaskDescription,
    dueDate,
    setDueDate,
    selectedDifficulty,
    setSelectedDifficulty,

    dailyEnergyLevel,
    filterOption,
    difficultyOptions,
    filterOptions,
    energyOptions,

    onCreateTask,
    onDeleteTask,
    onMarkComplete,
    onFilterChange,
    onDailyEnergyChange,
    onClearDailyEnergy,
    showStatusMessage,

    goToHome,
    goToStats,
    goToAppBlock,
  } = ViewModelToDoDashboard(navigation);

  function renderTask({ item }) {
    const isCompleted = Number(item.IsCompleted) === 1;

    return (
      <View style={[styles.taskCard, isCompleted && styles.completedTaskCard]}>
        <View style={styles.taskHeader}>
          <View
            style={[
              styles.taskStatusIcon,
              isCompleted && styles.taskStatusIconCompleted,
            ]}
          >
            <Text
              style={[
                styles.taskStatusText,
                isCompleted && styles.taskStatusTextCompleted,
              ]}
            >
              {isCompleted ? "✓" : "○"}
            </Text>
          </View>

          <View style={styles.taskHeaderContent}>
            <Text
              style={[styles.taskTitle, isCompleted && styles.completedTask]}
            >
              {item.TaskTitle}
            </Text>

            {item.TaskDescription ? (
              <Text style={styles.taskDescription}>{item.TaskDescription}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.taskMetaRow}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {item.DifficultyLevel || "No difficulty"}
            </Text>
          </View>

          {item.DueDate ? (
            <View style={styles.dueDateBadge}>
              <Text style={styles.dueDateText}>◷ {item.DueDate}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.taskDivider} />

        <View style={styles.taskActionRow}>
          <TouchableOpacity
            style={[styles.completeButton, isCompleted && styles.undoButton]}
            onPress={() => onMarkComplete(item.TaskID)}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              {isCompleted ? "↶  Undo" : "✓  Mark Done"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteTask(item.TaskID)}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusMessage = showStatusMessage();

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
                <Text style={styles.headerBadgeText}>TASKS</Text>
              </View>

              <View style={styles.userIcon}>
                <Text style={styles.userIconText}>👤</Text>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* PAGE INTRO */}
            <View style={styles.introSection}>
              <Text style={styles.pageEyebrow}>YOUR TASK SPACE</Text>
              <Text style={styles.pageTitle}>Plan with purpose.</Text>
              <Text style={styles.pageSubtitle}>
                A clearer mind starts with a better plan.
              </Text>
            </View>

            {/* DAILY ENERGY */}
            <View style={styles.energyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.energyIconContainer}>
                    <Text style={styles.energyIcon}>✦</Text>
                  </View>

                  <View>
                    <Text style={styles.cardEyebrow}>DAILY CHECK-IN</Text>
                    <Text style={styles.cardTitle}>Your Energy</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.cardDescription}>
                Match your tasks to how you're feeling today.
              </Text>

              <View style={styles.energyStatus}>
                <View style={styles.energyStatusDot} />
                <Text style={styles.energyStatusLabel}>CURRENT LEVEL</Text>
                <Text style={styles.energyStatusValue}>
                  {dailyEnergyLevel || "Not set"}
                </Text>
              </View>

              <TaskCategoryComponent
                label="Choose today's energy level"
                selectedValue={dailyEnergyLevel}
                options={energyOptions}
                onSelectValue={onDailyEnergyChange}
                placeholder="No energy chosen"
                allowEmpty={true}
              />

              <TouchableOpacity
                style={styles.clearEnergyButton}
                onPress={onClearDailyEnergy}
                activeOpacity={0.8}
              >
                <Text style={styles.clearEnergyText}>
                  Clear Energy Selection
                </Text>
              </TouchableOpacity>
            </View>

            {/* ADD TASK SECTION */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>STAY ORGANIZED</Text>
                <Text style={styles.sectionTitle}>Create a task</Text>
              </View>

              <View style={styles.sectionDecoration} />
            </View>

            <View style={styles.inputCard}>
              <View style={styles.inputCardHeader}>
                <View style={styles.addIconContainer}>
                  <Text style={styles.addIcon}>+</Text>
                </View>

                <View>
                  <Text style={styles.inputCardTitle}>New Task</Text>
                  <Text style={styles.inputCardSubtitle}>
                    Add something to your list.
                  </Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>TASK TITLE</Text>
              <TextInput
                style={styles.input}
                placeholder="What needs to get done?"
                placeholderTextColor={theme.muted}
                value={taskInput}
                onChangeText={setTaskInput}
              />

              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Add some details..."
                placeholderTextColor={theme.muted}
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.inputLabel}>DUE DATE</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.muted}
                value={dueDate}
                onChangeText={setDueDate}
              />

              <TaskCategoryComponent
                label="Task difficulty"
                selectedValue={selectedDifficulty}
                options={difficultyOptions}
                onSelectValue={setSelectedDifficulty}
                placeholder="No difficulty chosen"
                allowEmpty={true}
              />

              <TouchableOpacity
                style={styles.createButton}
                onPress={onCreateTask}
                activeOpacity={0.85}
              >
                <Text style={styles.createButtonIcon}>+</Text>
                <Text style={styles.createButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>

            {/* TASK LIST */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>YOUR PRIORITIES</Text>
                <Text style={styles.sectionTitle}>Task List</Text>
              </View>

              <View style={styles.taskCountBadge}>
                <Text style={styles.taskCountText}>
                  {displayedTaskList.length}
                </Text>
              </View>
            </View>

            {/* FILTERS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {filterOptions.map((filter) => {
                const isActive = filterOption === filter;

                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterButton,
                      isActive && styles.selectedFilterButton,
                    ]}
                    onPress={() => onFilterChange(filter)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        isActive && styles.selectedFilterText,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* TASKS */}
            <FlatList
              data={displayedTaskList}
              keyExtractor={(item) => item.TaskID.toString()}
              renderItem={renderTask}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <Text style={styles.emptyIcon}>✓</Text>
                  </View>

                  <Text style={styles.emptyTitle}>All clear for now.</Text>

                  <Text style={styles.emptyDescription}>
                    No tasks to show. Create a task above to get started.
                  </Text>
                </View>
              }
            />

            {/* STATUS */}
            {statusMessage ? (
              <View style={styles.statusBox}>
                <View style={styles.statusIndicator} />
                <Text style={styles.statusText}>{statusMessage}</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* BOTTOM NAVIGATION */}
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton} onPress={goToHome}>
              <Text style={styles.navIcon}>⌂</Text>
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <Text style={[styles.navIcon, styles.navIconActive]}>☷</Text>
              <Text style={[styles.navText, styles.navTextActive]}>Tasks</Text>
              <View style={styles.activeIndicator} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={goToStats}>
              <Text style={styles.navIcon}>▥</Text>
              <Text style={styles.navText}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={goToAppBlock}>
              <Text style={styles.navIcon}>⊘</Text>
              <Text style={styles.navText}>Blocking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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

  userIcon: {
    width: 41,
    height: 41,
    borderRadius: 21,
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    justifyContent: "center",
    alignItems: "center",
  },

  userIconText: {
    fontSize: 18,
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

  // SECTION HEADERS
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

  // ENERGY CARD
  energyCard: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  energyIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: theme.surfaceSelected,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  energyIcon: {
    fontSize: 22,
    color: theme.gold,
  },

  cardEyebrow: {
    color: theme.gold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 5,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.ivory,
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    marginBottom: 17,
  },

  energyStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceRaised,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  energyStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.gold,
    marginRight: 9,
  },

  energyStatusLabel: {
    color: theme.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    flex: 1,
  },

  energyStatusValue: {
    color: theme.ivory,
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },

  clearEnergyButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 4,
    alignItems: "center",
  },

  clearEnergyText: {
    color: theme.muted,
    fontWeight: "700",
    fontSize: 13,
  },

  // NEW TASK CARD
  inputCard: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
  },

  inputCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  addIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: theme.surfaceSelected,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  addIcon: {
    color: theme.gold,
    fontSize: 28,
    fontWeight: "400",
    marginTop: -2,
  },

  inputCardTitle: {
    color: theme.ivory,
    fontSize: 18,
    fontWeight: "700",
  },

  inputCardSubtitle: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 3,
  },

  inputLabel: {
    color: theme.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  input: {
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginBottom: 17,
    color: theme.ivory,
    fontSize: 14,
    minHeight: 49,
  },

  descriptionInput: {
    minHeight: 82,
    paddingTop: 13,
  },

  createButton: {
    backgroundColor: theme.emerald,
    borderRadius: 13,
    paddingVertical: 15,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  createButtonIcon: {
    color: theme.ivory,
    fontSize: 22,
    marginRight: 9,
    lineHeight: 23,
  },

  createButtonText: {
    color: theme.ivory,
    fontSize: 15,
    fontWeight: "700",
  },

  // TASK LIST
  taskCountBadge: {
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 11,
    minWidth: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  taskCountText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.gold,
  },

  // FILTERS
  filterRow: {
    paddingBottom: 17,
    paddingRight: 10,
  },

  filterButton: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginRight: 9,
  },

  selectedFilterButton: {
    backgroundColor: theme.surfaceSelected,
    borderColor: theme.gold,
  },

  filterText: {
    color: theme.muted,
    fontWeight: "600",
    fontSize: 12,
  },

  selectedFilterText: {
    color: theme.ivory,
    fontWeight: "800",
  },

  // TASK CARDS
  taskCard: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 18,
    padding: 17,
    marginBottom: 12,
  },

  completedTaskCard: {
    backgroundColor: "#142C23",
    borderColor: "#284938",
  },

  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  taskStatusIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 1,
  },

  taskStatusIconCompleted: {
    backgroundColor: theme.emerald,
    borderColor: theme.emerald,
  },

  taskStatusText: {
    color: theme.gold,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 21,
  },

  taskStatusTextCompleted: {
    color: theme.ivory,
    fontSize: 14,
    fontWeight: "800",
  },

  taskHeaderContent: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.ivory,
    lineHeight: 23,
  },

  completedTask: {
    textDecorationLine: "line-through",
    color: theme.muted,
  },

  taskDescription: {
    fontSize: 13,
    color: theme.muted,
    marginTop: 6,
    lineHeight: 20,
  },

  taskMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    marginBottom: 14,
    gap: 8,
  },

  difficultyBadge: {
    backgroundColor: theme.surfaceRaised,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  difficultyText: {
    color: theme.gold,
    fontSize: 11,
    fontWeight: "700",
  },

  dueDateBadge: {
    backgroundColor: theme.surfaceRaised,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  dueDateText: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "600",
  },

  taskDivider: {
    height: 1,
    backgroundColor: theme.outline,
    marginBottom: 13,
  },

  taskActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  completeButton: {
    backgroundColor: theme.emerald,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  undoButton: {
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  completeButtonText: {
    color: theme.ivory,
    fontSize: 12,
    fontWeight: "700",
  },

  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#67433F",
    backgroundColor: "#342421",
  },

  deleteButtonText: {
    color: theme.danger,
    fontWeight: "700",
    fontSize: 12,
  },

  // EMPTY STATE
  emptyContainer: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  emptyIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.surfaceSelected,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyIcon: {
    color: theme.gold,
    fontSize: 25,
    fontWeight: "700",
  },

  emptyTitle: {
    color: theme.ivory,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyDescription: {
    color: theme.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },

  // STATUS
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceRaised,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.outline,
    padding: 14,
    marginTop: 10,
  },

  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.gold,
    marginRight: 10,
  },

  statusText: {
    flex: 1,
    color: theme.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },

  // BOTTOM NAVIGATION
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
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
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
