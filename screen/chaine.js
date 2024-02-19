import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const Chaine = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const checkStringExists = async (inputText) => {
    try {
      const response = await fetch('https://firestore.googleapis.com/v1/projects/testlocation-8c657/databases/(default)/documents/locations');
      const data = await response.json();

      if (response.ok) {
        const documents = data.documents;
        const documentNames = documents.map((document) => document.name);

        const matchingDocument = documentNames.find((name) => name.endsWith(`/${inputText}`));

        if (matchingDocument) {
          // La chaîne saisie existe dans un document, naviguer vers l'autre page
          navigation.replace('Result', { inputText });
        } else {
          // La chaîne saisie n'existe pas dans un document
          setErrorMessage('La chaîne saisie n\'existe pas');
        }
      } else {
        // Gérer les erreurs de la requête
        setErrorMessage('Erreur de requête : ' + data.error);
      }
    } catch (error) {
      // Gérer les erreurs d'exception
      setErrorMessage('Erreur : ' + error.message);
    }
  };

  const saveString = () => {
    setErrorMessage('');
    if (inputText.trim() === '') {
      setErrorMessage('Veuillez saisir une chaîne de texte');
    } else {
      checkStringExists(inputText);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Saisissez l'identifient"
        onChangeText={text => setInputText(text)}
        value={inputText}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Enregistrer" onPress={saveString} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Chaine;
