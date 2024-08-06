import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateTaskScreen = ({ navigation }) => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTime(Platform.OS === 'ios');
    setDate(currentTime);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const showTimepicker = () => {
    setShowTime(true);
  };

  const addTask = () => {
    if (!task.trim() || !description.trim()) {
      Alert.alert('Error', 'La tarea y la descripción no pueden estar vacías.');
      return;
    }

    const now = new Date();
    if (isNaN(date.getTime())) {
      Alert.alert('Error', 'Ingrese una fecha límite válida.');
      return;
    }

    if (date < now) {
      Alert.alert('Error', 'La fecha límite debe ser mayor a la fecha y hora actuales.');
      return;
    }

    const newTask = { id: Math.random().toString(), task, description, date: date.toISOString(), done: false };
    navigation.navigate('Home', { newTask });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tarea"
        style={styles.input}
        onChangeText={setTask}
        value={task}
      />
      <TextInput
        placeholder="Descripción"
        style={styles.input}
        onChangeText={setDescription}
        value={description}
      />
      <View style={styles.dateContainer}>
        <Text style={styles.text}>Fecha seleccionada: {date.toDateString()}</Text>
        <Button onPress={showDatepicker} title="Seleccione Fecha" />
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.text}>Hora seleccionada: {date.toTimeString()}</Text>
        <Button onPress={showTimepicker} title="Seleccione Hora" />
        {showTime && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>
      <Button style={styles.agregar} title="Agregar Tarea" onPress={addTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 50,
  },
  input: {
    width: 300,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 50,
    padding: 10,
  },
  dateContainer: {
    width: 300,
    marginBottom: 10,
    marginLeft: 50,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default CreateTaskScreen;
