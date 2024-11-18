import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars{
    NODE_ENV: string;
    URL_MONGO_DB: string;
    PORT: number;
    DEFAULT_LIMIT: number;
}

const envsSchema=joi.object({
    URL_MONGO_DB: joi.string().required(),
    PORT: joi.number().required(),
    DEFAULT_LIMIT: joi.number().required(),
    NODE_ENV: joi.string().valid('development', 'production', 'test').required()
}).unknown(true);
 
const {error, value}= envsSchema.validate(process.env);
if(error){
    throw new Error(`Config validatation error: ${error.message}`)
}

const envVars: EnvVars= value;

export const envs ={
    port: envVars.PORT,
    urlMongoDB: envVars.URL_MONGO_DB,
    defaulLimit: envVars.DEFAULT_LIMIT,
    nodeEnv: envVars.NODE_ENV
}

export const EnvConfiguration = () => {
    return {
        port: envVars.PORT,
        urlMongoDB: envVars.URL_MONGO_DB,
        defaulLimit: envVars.DEFAULT_LIMIT,
        nodeEnv: envVars.NODE_ENV
    }
}