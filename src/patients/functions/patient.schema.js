import dynamoose from 'dynamoose';

// Define a schema for the Patient model
export const PatientSchema = new dynamoose.Schema(
    {
      //Chave primária
      PK: {
        type: String,
        hashKey: true,
      },
  
      //Dados do paciente
      id: String,
      taxId: String,
      healthInsurance: String,
      name: String,
      email: String,
      birthDate: String,
      phoneNumber: String,
      address: {
        type: Object,
        schema: {
          street: String,
          number: String,
          complement: String,
          neighborhood: String,
          city: String,
          state: String,
          zipCode: String,
        },
      },
  
      weight: Number,
      height: Number,
      bloodType: String,
    }
);
