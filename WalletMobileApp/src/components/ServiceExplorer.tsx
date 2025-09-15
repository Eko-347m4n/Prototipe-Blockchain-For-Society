import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { ethers } from 'ethers';

// Import all service functions
import * as DukcapilService from '../services/dukcapilService';
import * as PendidikanService from '../services/pendidikanService';
import * as SosialService from '../services/sosialService';
import * as KesehatanService from '../services/kesehatanService';

interface ServiceExplorerProps {
  wallet: ethers.Wallet;
}

const ServiceExplorer: React.FC<ServiceExplorerProps> = ({ wallet }) => {
  // Input states
  const [nik, setNik] = useState('');
  const [studentId, setStudentId] = useState('');
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [bpjsId, setBpjsId] = useState('');

  // Output states
  const [citizenData, setCitizenData] = useState<any>(null);
  const [academicRecord, setAcademicRecord] = useState<any>(null);
  const [aidRecord, setAidRecord] = useState<any>(null);
  const [bpjsData, setBpjsData] = useState<any>(null);

  const handleGetCitizenData = async () => {
    if (!nik) return Alert.alert('Input Required', 'Please enter a NIK.');
    const data = await DukcapilService.getCitizenData(nik);
    setCitizenData(data);
  };

  const handleGetAcademicRecord = async () => {
    if (!studentId) return Alert.alert('Input Required', 'Please enter a Student ID.');
    const record = await PendidikanService.getAcademicRecord(studentId);
    setAcademicRecord(record);
  };

  const handleGetAidRecord = async () => {
    if (!beneficiaryId) return Alert.alert('Input Required', 'Please enter a Beneficiary ID.');
    const record = await SosialService.getAidRecord(beneficiaryId);
    setAidRecord(record);
  };

  const handleGetBpjsData = async () => {
    if (!bpjsId) return Alert.alert('Input Required', 'Please enter a BPJS ID.');
    const data = await KesehatanService.getBPJSData(bpjsId);
    setBpjsData(data);
  };

  const handleSubmitSosial = async () => {
      await SosialService.submitSosialApplication(wallet, "Bantuan Langsung Tunai", "Application for BLT, amount 500k");
  }

  const renderData = (data: any) => {
    if (!data) return <Text>No data to display.</Text>;
    // The data object from ethers is a mix of array and object, so we filter for non-numeric keys.
    const keys = Object.keys(data).filter(key => isNaN(parseInt(key)));
    return keys.map(key => (
      <Text key={key} style={styles.dataText}>{`${key}: ${data[key].toString()}`}</Text>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Service Explorer</Text>

      {/* Dukcapil Service */}
      <View style={styles.serviceBox}>
        <Text style={styles.serviceTitle}>Layanan Kependudukan</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter NIK"
          value={nik}
          onChangeText={setNik}
        />
        <Button title="Get Citizen Data by NIK" onPress={handleGetCitizenData} />
        {citizenData && <View style={styles.dataBox}>{renderData(citizenData)}</View>}
      </View>

      {/* Pendidikan Service */}
      <View style={styles.serviceBox}>
        <Text style={styles.serviceTitle}>Layanan Pendidikan</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Student ID"
          value={studentId}
          onChangeText={setStudentId}
        />
        <Button title="Get Academic Record" onPress={handleGetAcademicRecord} />
        {academicRecord && <View style={styles.dataBox}>{renderData(academicRecord)}</View>}
      </View>

      {/* Kesehatan Service */}
      <View style={styles.serviceBox}>
        <Text style={styles.serviceTitle}>Layanan Kesehatan</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter BPJS ID"
          value={bpjsId}
          onChangeText={setBpjsId}
        />
        <Button title="Get BPJS Data" onPress={handleGetBpjsData} />
        {bpjsData && <View style={styles.dataBox}>{renderData(bpjsData)}</View>}
      </View>

      {/* Sosial Service */}
      <View style={styles.serviceBox}>
        <Text style={styles.serviceTitle}>Layanan Sosial</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Beneficiary ID"
          value={beneficiaryId}
          onChangeText={setBeneficiaryId}
        />
        <Button title="Get Aid Record" onPress={handleGetAidRecord} />
        {aidRecord && <View style={styles.dataBox}>{renderData(aidRecord)}</View>}
        <View style={{marginTop: 10}}>
            <Button title='Submit Sample BLT Application' onPress={handleSubmitSosial} />
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  serviceBox: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa'
  },
  dataBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  dataText: {
      fontFamily: 'monospace'
  }
});

export default ServiceExplorer;
