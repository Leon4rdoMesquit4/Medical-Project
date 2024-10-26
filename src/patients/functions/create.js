/*Este é o core do Middy. Ele cria um middleware engine que permite adicionar e 
combinar middlewares (como os listados abaixo) para modificar a função Lambda.*/
import middy from "@middy/core";

/*Lida com erros gerados durante a execução da Lambda. Quando um erro é detectado, 
este middleware formata a resposta HTTP com um código de erro apropriado e uma 
mensagem detalhada.*/
import httpErrorHandler from "@middy/http-error-handler";

/*Converte o corpo da requisição JSON em um objeto JavaScript acessível, 
facilitando o trabalho com dados recebidos no formato JSON.*/
import httpJsonBodyParser from "@middy/http-json-body-parser";

/*Normaliza os cabeçalhos HTTP da requisição, garantindo que todos os nomes de
cabeçalhos estejam em minúsculas e que os valores sejam strings.*/
import httpHeaderNormalizer from "@middy/http-header-normalizer";

/*Negocia o conteúdo da resposta HTTP com base no cabeçalho Accept da requisição.
Isso permite que a função Lambda retorne diferentes formatos de resposta, como JSON, XML ou texto.*/
import httpContentNegotiation from "@middy/http-content-negotiation";

/*Serializa a resposta HTTP com base no tipo de conteúdo negociado.
Por exemplo, se o cabeçalho Accept da requisição for application/xml, a resposta será serializada em XML.*/
import httpResponseSerializer from "@middy/http-response-serializer";
import PatientsService from "../patients.service.js";

const create = (event) => {
    const patient = PatientsService.createPatient(event.body);

    return {
        statusCode: 201,
        body: JSON.stringify(patient),
    };
}

export const handler = middy()
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
  .handler(create);