import dynamoose from "dynamoose"; // npm install --save dynamoose;
import { PatientSchema } from "./functions/patient.schema.js";
import crypto from "node:crypto";

const PatientModel = dynamoose.model("PatientT", PatientSchema, {
    create: false,
});

async function createPatient(payload) {
    payload.id = crypto.randomUUID();

    payload.PK = `PATIENT#${payload.id}`;

    const { PK, ...result } = await PatientModel.create(payload);

    return result;
}

async function findAllPatients() {
    const result = await PatientModel.scan().exec();

    return result.map((item) => {
        item.PK = undefined;
        return item;
    });
}

async function findPatientById(id) {
    const {PK, ...result} = await PatientModel.get(`PATIENT#${id}`);

    return result;
}

async function removePatientById(id) {
    const result = await PatientModel.delete({PK: `PATIENT#${id}`});

    return result;
}

async function updatePatientById(id, payload) {
    const patient = await PatientModel.get({id});

    if (!patient) {
        return null;
    }

    const updatedPatient = {
        ...payload,
        PK: `PATIENT#${id}`,
    };

    const result = await PatientModel.update({id}, updatedPatient);
    result.PK = undefined;

    return result;
}

export default {
    createPatient,
    findAllPatients, 
    findPatientById,
    removePatientById,
    updatePatientById
}
