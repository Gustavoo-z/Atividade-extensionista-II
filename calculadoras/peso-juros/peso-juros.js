import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-peso");
  const resultado = document.getElementById("resultado-peso");
  const resultadoContainer = document.querySelector(".resultado-peso");
  const btnSimular = document.querySelector(".btn-simular-peso");

  const valorInput = document.getElementById("valor-peso");
  const parcelasInput = document.getElementById("parcelas-peso");
  const taxaInput = document.getElementById("taxa-peso");

  let grafico = null;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const valor = parseFloat(valorInput.value);
    const parcelas = parseInt(parcelasInput.value);
    const taxa = parseFloat(taxaInput.value) / 100;

    if (
      isNaN(valor) ||
      isNaN(parcelas) ||
      isNaN(taxa) ||
      valor <= 0 ||
      parcelas <= 0 ||
      taxa < 0
    ) {
      resultado.innerHTML = `<p style="color: red;">Por favor, preencha todos os campos corretamente.</p>`;
      resultadoContainer.style.display = "block";
      return;
    }

    const parcelaValor =
      (valor * Math.pow(1 + taxa, parcelas) * taxa) /
      (Math.pow(1 + taxa, parcelas) - 1);
    const totalPago = parcelaValor * parcelas;
    const jurosTotal = totalPago - valor;

    resultado.innerHTML = `
    <div class="flex-peso">
    <div class="grafico-peso">
      <canvas id="grafico-peso" style="max-width: 350px;"></canvas>
    </div>
    <div class="valores-peso">
      <p class="resultado-valor-original"><strong>Valor da dívida:</strong> <span>${formatarValor(valor)}</span></p>
      <p class="resultado-total-pago"><strong>Valor total pago:</strong> <span>${formatarValor(totalPago)}</span></p>
      <p class="resultado-juros"><strong>Juros pagos:</strong> <span>${formatarValor(jurosTotal)}</span></p>
    </div>   
  </div>`;

    resultadoContainer.style.display = "block";

    if (grafico) grafico.destroy();

    const ctx = document.getElementById("grafico-peso").getContext("2d");
    grafico = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Valor da Dívida", "Total Pago"],
        datasets: [
          {
            label: "Comparativo de Valores",
            data: [valor, totalPago],
            backgroundColor: ["#ccc", "#ff5252"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => formatarValor(ctx.raw),
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "white" },
            title: {
              display: true,
              text: "Valor (R$)",
              color: "white",
            },
          },
          x: {
            ticks: { color: "white" },
          },
        },
      },
    });

    valorInput.disabled = true;
    valorInput.style.color = "white";
    parcelasInput.disabled = true;
    parcelasInput.style.color = "white";
    taxaInput.disabled = true;
    taxaInput.style.color = "white";
    btnSimular.style.display = "none";

    resultado.insertAdjacentHTML(
      "beforeend",
      `
      <div class="div-btn-simular-peso">
        <button id="btn-nova-simulacao" class="btn-simular-peso">Nova Simulação</button>
      </div>
    `,
    );

    document
      .getElementById("btn-nova-simulacao")
      .addEventListener("click", () => {
        form.reset();
        resultado.innerHTML = "";
        resultadoContainer.style.display = "none";
        btnSimular.style.display = "inline-block";
        valorInput.disabled = false;
        valorInput.style.color = "#000";
        parcelasInput.disabled = false;
        parcelasInput.style.color = "#000";
        taxaInput.disabled = false;
        taxaInput.style.color = "#000";

        if (grafico) grafico.destroy();
      });
  });
});
