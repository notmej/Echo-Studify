import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export default function ViewHomePage() {
  const [selectedTimerMode, setSelectedTimerMode] = useState('Pomodoro');
  const [durationInput, setDurationInput] = useState('25');
  const [displayedTime, setDisplayedTime] = useState('25:00');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSessionCountDisplay, setCurrentSessionCountDisplay] = useState(3);
  const [todayStreakDisplay, setTodayStreakDisplay] = useState(5);
  const [selectedBlockedApps, setSelectedBlockedApps] = useState(['Instagram', 'TikTok']);
  const [statusMessage, setStatusMessage] = useState('Ready to focus');

  const onStartSession = () => {
    setIsTimerRunning(true);
    setStatusMessage('Study session started');
  };


  const onStopSession = () => {
    setIsTimerRunning(false);
    setStatusMessage('Study session stopped');
  };



  const showTimer = () => displayedTime;
  const showSessionCount = () => currentSessionCountDisplay;
  const showStreak = () => todayStreakDisplay;


  const goToModeSelection = () => {
    setStatusMessage('Navigate to timer mode selection');
  };



  const goToAppBlockSelection = () => {
    setStatusMessage('Navigate to blocked apps selection');
  };

  const showStatusMessage = () => statusMessage;


  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>Studify</Text>
        <TouchableOpacity style={styles.userIcon}>
          <Text style={styles.userIconText}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Home</Text>
        <TouchableOpacity style={styles.optionButton} onPress={goToModeSelection}>
          <Text style={styles.optionLabel}>Timer Mode</Text>
          <Text style={styles.optionValue}>{selectedTimerMode}</Text>
        </TouchableOpacity>
        <View style={styles.inputBox}>
          <Text style={styles.optionLabel}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={durationInput}
            onChangeText={setDurationInput}
            keyboardType="numeric"
            placeholder="Enter duration"
            placeholderTextColor="#aa7f8d"
          />
        </View>

        {/* Timer Module */}
        <View style={styles.timerCard}>
          <Text style={styles.timerText}>{showTimer()}</Text>
        </View>

        {!isTimerRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={onStartSession}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={onStopSession}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Sessions</Text>
            <Text style={styles.infoValue}>{showSessionCount()}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Streak</Text>
            <Text style={styles.infoValue}>{showStreak()} days</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.optionButton} onPress={goToAppBlockSelection}>
          <Text style={styles.optionLabel}>Blocked Apps</Text>
          <Text style={styles.optionValue}>{selectedBlockedApps.join(', ')}</Text>
        </TouchableOpacity>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{showStatusMessage()}</Text>
        </View>
      </View>


      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeef4',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
  },

  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b85c7a',
  },
  userIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f8cad8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    fontSize: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9c4f68',
    marginBottom: 20,
  },

  optionButton: {
    backgroundColor: '#ffdbe7',
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
  },

  optionLabel: {
    fontSize: 14,
    color: '#9c4f68',
    marginBottom: 5,
  },

  optionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6e3a4b',
  },
  inputBox: {
    backgroundColor: '#ffdbe7',
    padding: 15,
    borderRadius: 18,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff6f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#6e3a4b',
  },
  timerCard: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#f9cddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  timerText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#8a4159',
  },

  startButton: {
    backgroundColor: '#e78aa8',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
  },

  stopButton: {
    backgroundColor: '#d96b8d',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#ffdbe7',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    color: '#9c4f68',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6e3a4b',
  },
  statusBox: {
    marginTop: 10,
    backgroundColor: '#fff6f9',
    padding: 14,
    borderRadius: 14,
  },

  statusText: {
    fontSize: 15,
    color: '#8a4159',
    textAlign: 'center',
  },

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8cad8',
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8a4159',
  },
});