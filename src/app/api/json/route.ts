import { NextRequest, NextResponse } from "next/server";
import { ZodTypeAny, z } from "zod";
import { replicate } from "@/lib/replicate";

const determineSchemaType = (schema: any) => {
  if (!schema.hasOwnProperty("type")) {
    if (Array.isArray(schema)) {
      return "array";
    } else {
      return typeof schema;
    }
  }
  return schema.type;
};

const jsonSchemaToZod = (schema: any): ZodTypeAny => {
  const type = determineSchemaType(schema);
  switch (type) {
    case "string":
      return z.string().nullable();
    case "number":
      return z.number().nullable();
    case "boolean":
      return z.boolean().nullable();
    case "array":
      return z.array(jsonSchemaToZod(schema.items)).nullable();
    case "object":
      const shape: Record<string, ZodTypeAny> = {};
      for (const key in schema) {
        if (key !== "type") {
          shape[key] = jsonSchemaToZod(schema[key]);
        }
      }
      return z.object(shape);
    default:
      throw new Error("Unsopported Data type" + type);
  }
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const generaicSchema = z.object({
    data: z.string(),
    format: z.object({}).passthrough() || z.string().optional(),
  });

  const { data, format } = generaicSchema.parse(body);


  const dynamicSchema = jsonSchemaToZod(format);

  type PromiseExecutor<T> = (
    resolve: (value: T) => void,
    reject: (reason?: any) => void
  ) => void;

  class RetryablePromise<T> extends Promise<T> {
    static async retry<T>(
      retries: number,
      executor: PromiseExecutor<T>
    ): Promise<T> {
      return new RetryablePromise(executor).catch((error) => {
        console.log(`Retrying due to Error: ${error}`);
        return retries > 0
          ? RetryablePromise.retry(retries - 1, executor)
          : RetryablePromise.reject(error);
      });
    }
  }

  const validatonResult = await RetryablePromise.retry<object>(
    3,
   async (resolve, reject) => {
      try {

        const content = `DATA: \n"${data}"\n\n-----------\nExpected JSON format: 
        ${JSON.stringify(format, null, 2)}
        \n\n-----------\nValid JSON output in expected example format:
        `

        const input = {
          top_k: 0,
          top_p: 1,
          prompt: content,
          temperature: 0.5,
          system_prompt: "You are a helpful AI that converts data into the attached JSON format. You respond with nothing but valid JSON based on input data. Your output should direclty be the JSON, nothing added before or after. You will begin with opening curly braces and end with closing curly braces. Only if you absolutely cannot determine a field, use value null. Expected answer should be in curly braces with key value pairs.",

          length_penalty: 1,
          max_new_tokens: 500,
          min_new_tokens: -1,
          prompt_template: "<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n{prompt} [/INST]",
          presence_penalty: 0
        };

        const text = await replicate.run("meta/llama-2-70b-chat", {input})

        console.log(typeof text) // object is coming

        

        return resolve(text|| "");
        
      } catch (error) {
        reject(error);
      }
    }
  );

  return NextResponse.json(validatonResult, { status: 200 });
};
