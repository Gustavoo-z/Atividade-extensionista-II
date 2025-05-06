import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-caminho");
  if (!form) return;
  const resultado = document.getElementById("resultado-caminho");
  const btnSimular = document.getElementsByClassName("btn-simular-caminho")[0];

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const metaInput = document.getElementById("meta-caminho");
    const mesesInput = document.getElementById("meses-caminho");
    const taxaInput = document.getElementById("taxa-caminho");

    const meta = parseFloat(document.getElementById("meta-caminho").value);
    const meses = parseInt(document.getElementById("meses-caminho").value);
    const taxa =
      parseFloat(document.getElementById("taxa-caminho").value) / 100;

    if (meta <= 0 || meses <= 0 || taxa < 0) {
      alert(
        "Por favor, insira valores válidos.\n- Meta > 0\n- Meses > 0\n- Taxa ≥ 0%",
      );
      return;
    }

    resultado.style.display = "block";
    btnSimular.style.display = "none";

    const aporteSemRendimento = meta / meses;

    let aporteComRendimento;
    if (taxa === 0) {
      aporteComRendimento = aporteSemRendimento;
    } else {
      const fator = (Math.pow(1 + taxa, meses) - 1) / taxa;
      aporteComRendimento = meta / fator;
    }

    resultado.innerHTML = `
      <p class="resultado-sem-rendimento"><strong>Investimento mensal sem rendimento:</strong> <span>${formatarValor(aporteSemRendimento)}</span></p>
      <p class="resultado-com-rendimento"><strong>Investimento mensal com rendimento:</strong> <span>${formatarValor(aporteComRendimento)}</span></p>`;

    const diferenca = aporteSemRendimento - aporteComRendimento;

    if (diferenca > 0) {
      const economiEmMeses = diferenca * meses;

      resultado.innerHTML += `
        <p class="resultado-caminho-2">Mensalmente uma economia <strong>${formatarValor(diferenca)}</strong> e no total dos <strong>${meses}</strong> meses você economizaria <strong>${formatarValor(economiEmMeses)}</strong>.</p>`;
    }

    resultado.innerHTML += `
      <div class="div-btn-simular-caminho">
        <button id="nova-simulacao-caminho" class="btn-simular-caminho">Nova Simulação</button>
      </div>`;

    metaInput.disabled = true;
    metaInput.style.color = "#f0f0f0";
    mesesInput.disabled = true;
    mesesInput.style.color = "#f0f0f0";
    taxaInput.disabled = true;
    taxaInput.style.color = "#f0f0f0";

    document
      .getElementById("nova-simulacao-caminho")
      .addEventListener("click", () => {
        form.reset();
        resultado.innerHTML = "";
        btnSimular.style.display = "block";
        metaInput.disabled = false;
        metaInput.style.color = "#000";
        mesesInput.disabled = false;
        mesesInput.style.color = "#000";
        taxaInput.disabled = false;
        taxaInput.style.color = "#000";
      });
  });
});
