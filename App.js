import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import image from './assets/imc_title.jpg';

import { TextInput, Button } from 'react-native-paper';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  const [values, setValues] = useState({
    weight: 0,
    height: 0,
    imc: 0,
    message: 'Indeterminado',
    color: '#008B8B',
  });

  const [valuesOld, setValuesOld] = useState({
    weightOld: 'Peso: 0 kg',
    heightOld: 'Altura: 0 metros',
    imcOld: 'IMC: 0',
  });

  function checkIMC() {

    var result = 0;

    if (values.weight != "" && values.weight != null && values.height != "" && values.height != null) {
      result = (values.weight / (values.height * values.height)).toFixed(2);
    }

    if (result > 0 && result < 17.1) {
      setValues({ ...values, message: 'Muito abaixo do peso.', color: '#00FA9A', imc: result })
    }
    else if (result >= 17.1 && result < 18.5) {
      setValues({ ...values, message: 'Abaixo do peso.', color: '#90EE90', imc: result })
    }
    else if (result >= 18.5 && result < 25) {
      setValues({ ...values, message: 'Peso normal.', color: '#BDB76B', imc: result })
    }
    else if (result >= 25 && result < 30) {
      setValues({ ...values, message: 'Acima do peso.', color: '#FF6347', imc: result })
    }
    else if (result >= 30 && result < 35) {
      setValues({ ...values, message: 'Obesidade I.', color: '#FF0000', imc: result })
    }
    else if (result >= 35 && result < 40) {
      setValues({ ...values, message: 'Obesidade II(severa).', color: '#B22222', imc: result })
    }
    else if (result >= 40) {
      setValues({ ...values, message: 'Obesidade III(mórbida).', color: '#800000', imc: result })
    }
    else {
      setValues({ ...values, message: 'Indeterminado', color: '#008B8B', imc: result })
    }

    //Salva no banco
    saveValues(values.weight, values.height, result)
  }

  const saveValues = async (weightSave, heightSave, imcSave) => {

    try {

      //Busca no banco o anterior
      restoredValuesSave()

      const jsonValueWeight = JSON.stringify(weightSave)
      await AsyncStorage.setItem('@vl_weight', jsonValueWeight)

      const jsonValueHeight = JSON.stringify(heightSave)
      await AsyncStorage.setItem('@vl_height', jsonValueHeight)

      const jsonValueImc = JSON.stringify(imcSave)
      await AsyncStorage.setItem('@vl_imc', jsonValueImc)

    } catch (e) {
      // saving error
    }
  }

  const getWeight = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@vl_weight')
      if (jsonValue !== null) {
        // se o jsonValue for diferente de null, quer dizer que já havia sido salvo anteriormente.
        return "Peso: " + String(JSON.parse(jsonValue)) + " kg";
      }
    } catch (e) {
      // error reading value
    }
  }

  const getHeight = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@vl_height')
      if (jsonValue !== null) {
        // se o jsonValue for diferente de null, quer dizer que já havia sido salvo anteriormente.
        return "Altura: " + String(JSON.parse(jsonValue)) + " metros";
      }
    } catch (e) {
      // error reading value
    }
  }

  const getImc = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@vl_imc')
      if (jsonValue !== null) {
        // se o jsonValue for diferente de null, quer dizer que já havia sido salvo anteriormente.
        return "IMC: " + String(JSON.parse(jsonValue));
      }
    } catch (e) {
      // error reading value
    }
  }

  async function restoredValuesSave() {

    var restoredWeight = await getWeight();
    var restoredHeight = await getHeight();
    var restoredImc = await getImc();

    if (restoredWeight == null) {
      restoredWeight = 0;
    }
    if (restoredHeight == null) {
      restoredHeight = 0;
    }
    if (restoredImc == null) {
      restoredImc = 0;
    }

    setValuesOld({ weightOld: restoredWeight, heightOld: restoredHeight, imcOld: restoredImc });

  }

  useEffect(() => {
    restoredValuesSave();
  }, []);

  return (
    <ScrollView>
      <View style={styles.app}>

        <Text style={styles.text}>CALCULADORA IMC</Text>

        <View style={styles.container}>
          <Image source={image} style={{ width: 400, height: 300 }} />
        </View>

        <View>
          <TextInput
            style={styles.weight}
            label="Digite o seu peso em Kg:"
            keyboardType="numeric"
            onChangeText={(textWeight) => setValues({ ...values, weight: textWeight.replace(',', '.') })}
          />
          <TextInput
            style={styles.height}
            label="Digite a sua altura em metros:"
            keyboardType="numeric"
            onChangeText={(textHeight) => setValues({ ...values, height: textHeight.replace(',', '.') })}
          />
          <Button style={styles.button} mode="contained" onPress={checkIMC}>
            Calcular
          </Button>
        </View>

        <Text style={styles.text}>RESULTADO IMC</Text>

        <View style={[styles.panel, { backgroundColor: values.color }]}>
          <Text style={styles.value}> {values.imc} </Text>
          <Text style={styles.result}> {values.message} </Text>
        </View>

        <Text style={styles.text}>RESULTADO IMC ANTERIOR</Text>

        <View style={[styles.panel, { backgroundColor: "#d4d4d4" }]}>
          <Text style={styles.value}> {valuesOld.weightOld}</Text>
          <Text style={styles.result}> {valuesOld.heightOld}</Text>
          <Text style={styles.value}> {valuesOld.imcOld}</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  app: {
    padding: 10,
    backgroundColor: '#00FFFF'
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 25,
    marginTop: 8,
    padding: 8,
  },
  panel: {
    alignSelf: 'center',
    borderRadius: 5,
    width: 350,
    marginVertical: 10,
    padding: 8,
  },
  value: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  result: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  weight: {
    marginTop: 8,
    marginVertical: 10,
    fontSize: 20,
    backgroundColor: '#008B8B',
    fontcolor: 'white'
  },
  height: {
    marginTop: 8,
    marginVertical: 10,
    fontSize: 20,
    backgroundColor: '#008B8B',
    color: 'white'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 8,
    backgroundColor: '#008B8B',
    color: 'white'
  }
});
