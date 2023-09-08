import React, { useState } from "react";
import { updateProducts, validateCSV } from "../services/api";
import Papa from "papaparse";
import "../style/style.css";
import { useEffect } from "react";

export default function Uploader() {
  const [produtos, setProdutos] = useState([]);
  const [validateProducts, setValidateProducts] = useState([]);
  const [updateValid, setUpdateValid] = useState(false);

  const changeHandler = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setProdutos(results.data);
      },
    });
  };

  const getErrorMessage = (errorType) => {
    switch (errorType) {
      case 0:
        return "Sem Erros,liberado para atualização";
      case 1:
        return "Campo obrigatório não preenchido";
      case 2:
        return "Código de produto inexistente";
      case 3:
        return "Novo preço inválido";
      case 4:
        return "Novo preço menor que custo";
      case 5:
        return "Novo preço ultrapassa limite de 10%";
      default:
        return "Erro desconhecido";
    }
  };

  function Table() {
    if (validateProducts.length > 0) {
      return (
        <>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço Atual</th>
                <th>Novo Preço</th>
                <th>Tipo de Erro</th>
              </tr>
            </thead>
            <tbody>
              {validateProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.code || ""}</td>
                  <td>{product.name || "Não Encontrado"}</td>
                  <td>{product.actual_price || "null"}</td>
                  <td>{product.new_price || "null"}</td>
                  <td>{getErrorMessage(product.errorType) || "null"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    } else {
      return <p>Ainda não nenhuma verifcação foi solicitada</p>;
    }
  }

  useEffect(() => {
    const allProductsValid = validateProducts.every(
      (product) => product.errorType === 0
    );
    setUpdateValid(allProductsValid);
    Table();
  }, [validateProducts]);

  const checkData = () => {
    const products = validateCSV(produtos);
    products
      .then((result) => {
        setValidateProducts(result.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onUpdate = () => {
    updateProducts(produtos);
  };

  return (
    <>
      <input
        type="file"
        name="file"
        id="file"
        accept=".csv"
        onChange={changeHandler}
        className="upload"
      />
      <button onClick={checkData} className="btn">
        VERIFICAR
      </button>

      <Table />
      {
        <button onClick={onUpdate} className="btn" disabled={updateValid ? false : true}>
          ATUALIZAR
        </button>
      }
    </>
  );
}
