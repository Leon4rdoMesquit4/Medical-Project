import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import PatientsService from "../patients.service.js";

const findAll = async () => {
    try {
        const patient = await PatientsService.findAllPatients();
        return {
            statusCode: 201,
            body: patient,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
}
const findById = async (event) => {
    const { id } = event.pathParameters;
    try {
    const patient = await PatientsService.findPatientById(id);

    if (!patient) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Patient not found" }),
        };
    }
    return {
        statusCode: 200,
        body: patient,
    };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
}

export const findAllHandler = middy()
  .use(httpHeaderNormalizer())
  .use(httpContentNegotiation())
  .use(
    httpResponseSerializer({
        //serializers: Uma lista de objetos onde cada um define um tipo de conteúdo (regex) 
        //e um método (serializer) para transformar a resposta de acordo com o formato solicitado.
      serializers: [
        {
          regex: /^application\/xml$/,
          serializer: ({ body }) => `<message>${body}</message>`,
        },
        {
          regex: /^application\/json$/,
          serializer: ({ body }) => JSON.stringify(body),
        },
        {
          regex: /^text\/plain$/,
          serializer: ({ body }) => body,
        },
      ],
      //defaultContentType: O tipo de conteúdo padrão a ser usado se o cabeçalho Accept não for fornecido.
      defaultContentType: "application/json",
    })
  )
  .use(httpErrorHandler())
  .use(httpJsonBodyParser({ disableContentTypeError: true }))
  .handler(findAll);

export const findByIdHandler = middy()
  .use(httpHeaderNormalizer())
  .use(httpContentNegotiation())
  .use(
    httpResponseSerializer({
        //serializers: Uma lista de objetos onde cada um define um tipo de conteúdo (regex) 
        //e um método (serializer) para transformar a resposta de acordo com o formato solicitado.
      serializers: [
        {
          regex: /^application\/xml$/,
          serializer: ({ body }) => `<message>${body}</message>`,
        },
        {
          regex: /^application\/json$/,
          serializer: ({ body }) => JSON.stringify(body),
        },
        {
          regex: /^text\/plain$/,
          serializer: ({ body }) => body,
        },
      ],
      //defaultContentType: O tipo de conteúdo padrão a ser usado se o cabeçalho Accept não for fornecido.
      defaultContentType: "application/json",
    })
  )
  .use(httpErrorHandler())
  .use(httpJsonBodyParser({ disableContentTypeError: true }))
  .handler(findById);