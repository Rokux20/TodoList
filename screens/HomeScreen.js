import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [pickerValue, setPickerValue] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks from AsyncStorage', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    if (isFocused && route.params?.newTask) {
      const updatedTasks = [...tasks, route.params.newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      navigation.setParams({ newTask: null });
    }
  }, [isFocused, route.params?.newTask]);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to AsyncStorage', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (!task.done) {
            const now = new Date();
            const deadline = new Date(task.date);
            const timeRemaining = deadline - now;

            if (timeRemaining <= 5 * 60 * 1000 && timeRemaining > 0 && !task.alertShown) {
              Alert.alert('Aviso', `Faltan 5 minutos para completar la tarea: ${task.task}`);
              return { ...task, alertShown: true, timeRemaining };
            }

            if (timeRemaining <= 0) {
              return { ...task, done: true };
            } else {
              return { ...task, timeRemaining };
            }
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const markAsDone = async (taskId) => {
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, done: true } : task);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handlePickerChange = (itemValue) => {
    setSelectedTask(itemValue);
    setPickerValue(itemValue);
  };

  const deleteTask = async (taskId) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Está seguro de que desea eliminar esta tarea?',
      [
        { text: 'Cancelar', onPress: () => setSelectedTask(null) },
        { text: 'Eliminar', onPress: async () => {
          const updatedTasks = tasks.filter(task => task.id !== taskId);
          setTasks(updatedTasks);
          saveTasks(updatedTasks);
          setSelectedTask(null);
          setPickerValue(null);
        } }
      ]
    );
  };

  const formatTimeRemaining = (timeRemaining) => {
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={item.done ? styles.done : null}>{item.task}</Text>
      {!item.done && item.timeRemaining !== undefined && (
        <Text>{formatTimeRemaining(item.timeRemaining)}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <Button title="Crear Tarea" onPress={() => navigation.navigate('CreateTask')} />
      <Picker
        selectedValue={"Seleccione una tarea"}
        onValueChange={handlePickerChange}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una tarea" value={null} />
        {tasks.map(task => (
          <Picker.Item key={task.id} label={task.task} value={task.id} />
        ))}
      </Picker>
      
      {selectedTask && (
        <View style={styles.taskDetails}>
          {tasks.filter(task => task.id === selectedTask).map(task => (
            <View key={task.id}>
              <Text style={task.done ? styles.done : null}>{task.task}</Text>
              <Text style={task.done ? styles.done : null}>{task.description}</Text>
              <Text style={task.done ? styles.done : null}>Fecha límite: {formatDateTime(task.date)}</Text>
              {!task.done && (
                <>
                  <View style={styles.taskButtons}>
                    <Button title="Marcar como hecha" onPress={() => markAsDone(task.id)} />
                    <Button title="Eliminar Tarea" onPress={() => deleteTask(task.id)} color="red" />
                  </View>
                </>
              )}
            </View>
          ))}
        </View>
      )}
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  taskDetails: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#eee',
    borderColor: 'black',
    borderWidth: 1,
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9c2ff',
    borderColor: 'black',
    borderWidth: 1,
  },
  taskList: {
    marginTop: 20,
  },
  done: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  taskButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default HomeScreen;
