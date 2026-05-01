import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
} from 'react-native';

export default function ViewToDoDashboard({navigation}) {
  const [taskList, setTaskList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Easy');
  const [taskInput, setTaskInput] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filterOption, setFilterOption] = useState('All');
  const [sortOption, setSortOption] = useState('None');
  const [statusMessage, setStatusMessage] = useState('No tasks yet');


  const onCreateTask = () => {
    if (!taskInput) return;
    const newTask = {
      id: Date.now().toString(),
      title: taskInput,
      description: taskDescription,
      category: selectedCategory,
      dueDate: dueDate,
      completed: false,
    };

    setTaskList([...taskList, newTask]);
    setTaskInput('');
    setTaskDescription('');
    setDueDate('');
    setStatusMessage('Task created');
  };
  const onDeleteTask = (id) => {
    setTaskList(taskList.filter(task => task.id !== id));
    setStatusMessage('Task deleted');
  };

  const onMarkComplete = (id) => {
    setTaskList(taskList.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    setStatusMessage('Task updated');
  };
  const onEditTask = () => {
    setStatusMessage('Edit feature coming soon');
  }
  const onFilterChange = (filter) => {
    setFilterOption(filter);
  };
  const onSortChange = (sort) => {
    setSortOption(sort);
  };

  const displayTasks = () => {
    let filtered = [...taskList];
    if (filterOption === 'Completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filterOption === 'Pending') {
      filtered = filtered.filter(task => !task.completed);
    }


    if (sortOption === 'DueDate') {
      filtered.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
    }

    return filtered;
  };

  const showStatusMessage = () => statusMessage;

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Tasks</Text>


        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Task title"
            placeholderTextColor="#bf40fa"
            value={taskInput}
            onChangeText={setTaskInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#bf40fa"
            value={taskDescription}
            onChangeText={setTaskDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Due Date"
            placeholderTextColor="#bf40fa"
            value={dueDate}
            onChangeText={setDueDate}
          />

          <View style={styles.row}>
            {['Easy', 'Medium', 'Hard'].map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.createButton} onPress={onCreateTask}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => onFilterChange('All')}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onFilterChange('Completed')}>
            <Text style={styles.filterText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onFilterChange('Pending')}>
            <Text style={styles.filterText}>Pending</Text>
          </TouchableOpacity>
        </View>

      
        <FlatList
          data={displayTasks()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={[
                styles.taskTitle,
                item.completed && styles.completedTask
              ]}>
                {item.title}
              </Text>

              <Text style={styles.taskInfo}>{item.category} | {item.dueDate}</Text>

              <View style={styles.row}>
                <TouchableOpacity onPress={() => onMarkComplete(item.id)}>
                  <Text style={styles.actionText}>✓</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDeleteTask(item.id)}>
                  <Text style={styles.actionText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <Text style={styles.status}>{showStatusMessage()}</Text>
  {/* ------------------------------------------------------------------------------ */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
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
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9c4f68',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  inputCard: {
    backgroundColor: '#5b2a62',
    padding: 15,
    borderRadius: 19,
    marginBottom: 15,
  },

  input: {
    backgroundColor: '#040607',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: "#bf40fa",
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },

  categoryButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#4928c2',
  },

  selectedCategory: {
    backgroundColor: '#bf40fa',
  },

  categoryText: {
    color: '#040607',
  },

  createButton: {
    backgroundColor: '#bf40fa',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: '#40607',
    fontWeight: 'bold',
  },

  filterText: {
    backgroundColor: "#e3d9fc",
    color: '#4928c2',
    fontWeight: '600',

    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  taskCard: {
    backgroundColor: '#ffdbe7',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6e3a4b',
  },

  completedTask: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskInfo: {
    fontSize: 12,
    color: '#8a4159',
    marginVertical: 5,
  },
  actionText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  status: {
    textAlign: 'center',
    marginTop: 10,
    color: '#8a4159',
  },

  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4928c2',
    paddingVertical: 20,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  navButton: {
    alignItems: 'center',
  },

  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#040607',
  },
});