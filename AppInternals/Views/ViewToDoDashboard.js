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
} from "react-native";

import ViewModelToDoDashboard from "../ViewModels/ViewModelToDoDashboard";
import TaskCategoryComponent from "../Components/TaskCategoryComponent";

const color1 = "#c49572";
const color3 = "#876146";
const color4 = "#a76c40";
const color6 = "#f7d9b7";
const brownColor = "#2a1902";
const inputBoxColor = "#F3E4C9";

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
      <View style={styles.taskCard}>
        <Text style={[styles.taskTitle, isCompleted && styles.completedTask]}>
          {item.TaskTitle}
        </Text>

        {item.TaskDescription ? (
          <Text style={styles.taskDescription}>{item.TaskDescription}</Text>
        ) : null}

        <Text style={styles.taskInfo}>
          Difficulty: {item.DifficultyLevel || "None"}
          {item.DueDate ? " | Due: " + item.DueDate : ""}
        </Text>

        <View style={styles.taskActionRow}>
          <TouchableOpacity
            style={styles.smallActionButton}
            onPress={() => onMarkComplete(item.TaskID)}
          >
            <Text style={styles.actionText}>{isCompleted ? "Undo" : "Done"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteTask(item.TaskID)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Tasks</Text>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.energyCard}>
            <Text style={styles.cardTitle}>Daily Energy</Text>
            <Text style={styles.energyText}>
              Current: {dailyEnergyLevel || "Not chosen today"}
            </Text>

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
            >
              <Text style={styles.clearEnergyText}>Clear Energy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.cardTitle}>Add Task</Text>

            <TextInput
              style={styles.input}
              placeholder="Task title"
              placeholderTextColor={brownColor}
              value={taskInput}
              onChangeText={setTaskInput}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={brownColor}
              value={taskDescription}
              onChangeText={setTaskDescription}
            />

            <TextInput
              style={styles.input}
              placeholder="Due Date, e.g. 2026-05-12"
              placeholderTextColor={brownColor}
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

            <TouchableOpacity style={styles.createButton} onPress={onCreateTask}>
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  filterOption === filter && styles.selectedFilterButton,
                ]}
                onPress={() => onFilterChange(filter)}
              >
                <Text style={styles.filterText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={displayedTaskList}
            keyExtractor={(item) => item.TaskID.toString()}
            renderItem={renderTask}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No tasks to show.</Text>
            }
          />

          <Text style={styles.status}>{showStatusMessage()}</Text>
        </ScrollView>

        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={goToHome}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={goToStats}>
            <Text style={styles.navText}>Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={goToAppBlock}>
            <Text style={styles.navText}>App Blocking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  content: {
    flex: 1,
  },

  contentScroll: {
    paddingBottom: 120,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: brownColor,
    marginBottom: 15,
    alignSelf: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: brownColor,
    marginBottom: 10,
    textAlign: "center",
  },

  energyCard: {
    backgroundColor: color1,
    padding: 15,
    borderRadius: 19,
    marginBottom: 15,
  },

  energyText: {
    color: brownColor,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  clearEnergyButton: {
    backgroundColor: inputBoxColor,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  clearEnergyText: {
    color: brownColor,
    fontWeight: "bold",
  },

  inputCard: {
    backgroundColor: color3,
    padding: 15,
    borderRadius: 19,
    marginBottom: 15,
  },

  input: {
    backgroundColor: inputBoxColor,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: color3,
  },

  createButton: {
    backgroundColor: color1,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
  },

  buttonText: {
    color: brownColor,
    fontWeight: "bold",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },

  filterButton: {
    backgroundColor: color6,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  selectedFilterButton: {
    backgroundColor: color1,
    borderWidth: 1,
    borderColor: brownColor,
  },

  filterText: {
    color: color4,
    fontWeight: "700",
  },

  taskCard: {
    backgroundColor: color6,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6e3a4b",
  },

  completedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },

  taskDescription: {
    fontSize: 13,
    color: brownColor,
    marginTop: 5,
  },

  taskInfo: {
    fontSize: 12,
    color: brownColor,
    marginVertical: 6,
  },

  taskActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  smallActionButton: {
    backgroundColor: inputBoxColor,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  deleteButton: {
    backgroundColor: color1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  actionText: {
    color: brownColor,
    fontWeight: "bold",
  },

  emptyText: {
    color: brownColor,
    textAlign: "center",
    fontWeight: "700",
    marginTop: 15,
  },

  status: {
    textAlign: "center",
    marginTop: 10,
    color: brownColor,
    fontWeight: "700",
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