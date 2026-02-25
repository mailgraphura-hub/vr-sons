import axios from 'axios';

const Api_Url = "/api/v1";

export const postService = async(path, data) => {
    try{
        const apiResponse = await axios.post(
            `${Api_Url}${path}`,
            data,
            {withCredentials: true}
        )

        return {ok: true, fetchMessage: true, data:apiResponse.data}
    }
    catch(err){
        if(err.response){
            return {ok: false, fetchMessage: true, message: err.response.data.message }
        }
        else{
            return {ok: false, fetchMessage: false, message: err.message }
        }
    }
};

export const getService = async (path) => {
    try{
        const apiResponse = await axios.get(
             `${Api_Url}${path}`,
             {withCredentials: true}
        );

        return{ok: true, fetchMessage: true, data:apiResponse.data}
    }
    catch(err){
         if(err.response){
            return {ok: false, fetchMessage: true, message: err.response.data.message }
        }
        else{
            return {ok: false, fetchMessage: false, message: err.message }
        }
    }
}

export const putService = async (path, data) => {
    try{
        const apiResponse = await axios.put(
             `${Api_Url}${path}`,
             data,
             {withCredentials: true}
        );

        return {ok: true, fetchMessage: true, data:apiResponse.data}
    }
    catch(err){
         if(err.response){
            return {ok: false, fetchMessage: true, message: err.response.data.message }
        }
        else{
            return {ok: false, fetchMessage: false, message: err.message }
        }
    }
}

export const patchService = async(path, data) => {
    try{

        const apiResponse = await axios.patch(
             `${Api_Url}${path}`,
             data,
             {withCredentials: true}
        );

        return {ok: true, fetchMessage: true, data:apiResponse.data}
    }
    catch(err){
         if(err.response){
            return {ok: false, fetchMessage: true, message: err.response.data.message }
        }
        else{
            return {ok: false, fetchMessage: false, message: err.message }
        }
    }
}

export const deleteService = async (path, data) => {
    try{
        const apiResponse = await axios.delete(
             `${Api_Url}${path}`,
             data,
             {withCredentials: true}
        )

        return {ok: true, fetchMessage: true, data: apiResponse.data}
    }
    catch(err){
        if(err.response){
            return {ok: false, fetchMessage: true, message: err.response.data.message}
        }
        else{
            return {ok: false, fetchMessage: false, message: err.message}
        }
    }
}