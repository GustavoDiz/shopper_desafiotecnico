import React from "react";
import Uploader from "./components/Uploader";
import "./style/style.css";
function App() {
  return (
    <div className="container">
      <h1>Upload CSV</h1>
      <p>
        Para começar, clique no botão 'Escolher Arquivo' e selecione o seu
        arquivo CSV. Após isso, clique em <b>Verificar</b> para validar os dados. Se
        tudo estiver correto, o botão <b>Atualizar</b> ficará disponível para
        confirmar as alterações.
      </p>
      <Uploader />
    </div>
  );
}

export default App;
