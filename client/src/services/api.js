import axios from "axios";
const API_URL = 'http://localhost:3001/api';

export const updateProducts = async (products) => {
    console.log(products);
    try {
      const response = await axios.post(`${API_URL}/updateprices`,{
        products : products
      });
      console.log(response.data);
      if (response.data.sucess) {
        console.log('Preços atualizados com sucesso!');
      } else {
        throw new Error('Erro ao atualizar os preços');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  };

export const validateCSV = async(products) => {
  try {
    const response = await axios.post(`${API_URL}/validate`,{
      products : products
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
      throw error;
  }
}

