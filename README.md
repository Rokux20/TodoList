# TodoList App

## Descripción

TodoList App es una aplicación de gestión de tareas desarrollada con React Native y Expo. La aplicación permite a los usuarios crear, eliminar y marcar tareas como completadas. Además, cuenta con una funcionalidad de cuenta regresiva que notifica a los usuarios cuando una tarea está a punto de vencer, mostrando una alerta cuando quedan 5 minutos.

## Características

- **Crear Tareas:** Los usuarios pueden crear nuevas tareas con una descripción y una fecha/hora límite.
- **Eliminar Tareas:** Los usuarios pueden eliminar tareas que ya no sean necesarias.
- **Marcar como Completada:** Las tareas pueden ser marcadas como completadas.
- **Cuenta Regresiva:** La aplicación muestra una cuenta regresiva para cada tarea y alerta a los usuarios cuando quedan 5 minutos para completarla.
- **Almacenamiento Persistente:** Las tareas se guardan en el almacenamiento local del dispositivo utilizando `AsyncStorage`.

## Tecnologías Utilizadas

- **React Native:** Biblioteca de desarrollo móvil para construir aplicaciones nativas usando JavaScript y React.
- **Expo:** Plataforma que facilita el desarrollo, construcción y despliegue de aplicaciones React Native.
- **@react-native-async-storage/async-storage:** Biblioteca para almacenamiento local persistente.
- **@react-native-picker/picker:** Componente de selector para seleccionar tareas.
- **React Navigation:** Biblioteca de navegación para React Native.

## Instalación

Sigue estos pasos para instalar y ejecutar la aplicación en tu entorno local:

 Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/todolist-app.git
   cd todolist-app
