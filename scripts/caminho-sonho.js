document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-meta");
  if (!form) return;
  const resultado = document.getElementById("resultado-meta");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    resultado.style.display = "block";

    const meta = parseFloat(document.getElementById("meta").value);
    const meses = parseInt(document.getElementById("meses").value);
    const taxa = parseFloat(document.getElementById("taxa-meta").value) / 100;

    if (meta <= 0 || meses <= 0 || taxa < 0) {
      alert("Por favor, insira valores válidos.");
      return;
    }

    const aporteSemRendimento = meta / meses;

    let aporteComRendimento;
    if (taxa === 0) {
      aporteComRendimento = aporteSemRendimento;
    } else {
      const fator = (Math.pow(1 + taxa, meses) - 1) / taxa;
      aporteComRendimento = meta / fator;
    }

    resultado.innerHTML = `
      <p><strong>Aporte mensal sem rendimento:</strong> ${formatarValor(aporteSemRendimento)}</p>
      <p><strong>Aporte mensal com rendimento:</strong> ${formatarValor(aporteComRendimento)}</p>`;

      const diferenca = aporteSemRendimento - aporteComRendimento;

      if (diferenca > 0) {
      const economiaAnual = diferenca * 12;

      resultado.innerHTML += `
        <hr style="margin: 1rem 0; border-top: 1px solid #ccc;">
        <p><strong>Com base nos cálculos, mensalmente sobraria:</strong> 
          <span style="color: #007bff;">${formatarValor(diferenca)}</span>
        </p>
        <p><strong>Economia total ao longo de um ano:</strong> 
          <span style="color: #28a745;">${formatarValor(economiaAnual)}</span>
        </p>
        <p>
          Esse valor pode ser usado para outras metas, lazer ou reforço na sua reserva financeira.
        </p>`;
      }
  });

  function formatarValor(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
});