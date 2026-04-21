import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';

export default function ViewToDoDashboard() {
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
    <View style={styles.container}>
      <Text style={styles.heading}>Tasks</Text>


      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Task title"
          value={taskInput}
          onChangeText={setTaskInput}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={taskDescription}
          onChangeText={setTaskDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeef4',
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9c4f68',
    marginBottom: 15,
  },

  inputCard: {
    backgroundColor: '#ffdbe7',
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
  },

  input: {
    backgroundColor: '#fff6f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },

  categoryButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f8cad8',
  },

  selectedCategory: {
    backgroundColor: '#e78aa8',
  },

  categoryText: {
    color: '#6e3a4b',
  },

  createButton: {
    backgroundColor: '#e78aa8',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  filterText: {
    color: '#8a4159',
    fontWeight: '600',
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
});