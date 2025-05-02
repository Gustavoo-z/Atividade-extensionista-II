import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-paciencia");
  const resultado = document.getElementById("resultado-paciencia");
  const canvas = document.getElementById("grafico-paciencia");
  const graficoContainer = document.getElementById("graficoContainer-paciencia");

  let grafico;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (grafico) grafico.destroy();
    graficoContainer.style.display = "none";
    
    resultado.style.display = "block";
    resultado.innerHTML = "";
    const btnNovaSimulacaoExistente = document.getElementById("btn-nova-simulacao");
    if (btnNovaSimulacaoExistente) {
      btnNovaSimulacaoExistente.parentElement.remove();
    }
  
    const valorVista = parseFloat(document.getElementById("valor-vista").value);
    const valorParcelado = parseFloat(document.getElementById("valor-parcelado").value);
    const parcelas = parseInt(document.getElementById("qtd-parcelas").value);
    const taxa = parseFloat(document.getElementById("taxa-paciencia").value) / 100;

    const valorVistaInput = document.getElementById("valor-vista");
    const valorParceladoInput = document.getElementById("valor-parcelado");
    const parcelasInput = document.getElementById("qtd-parcelas");
    const taxaInput = document.getElementById("taxa-paciencia");
    const botaoSimular = document.querySelector(".btn-simular-paciencia");

    if (
      valorVista <= 0 ||
      valorParcelado <= 0 ||
      isNaN(parcelas) || parcelas <= 0 ||
      isNaN(taxa)
    ) {
      resultado.innerHTML = `<p style='color:red;'>Preencha todos os campos corretamente.</p>`;
      return;
    }

    if (valorParcelado < valorVista) {
      resultado.innerHTML = `<p style='color:red;'><strong>O valor parcelado não pode ser menor que o valor à vista. Corrija os valores informados.</strong></p>`;
      return;
    }

    valorVistaInput.disabled = true;
    valorVistaInput.style.color = "#f0f0f0";
    valorParceladoInput.disabled = true;
    valorParceladoInput.style.color = "#f0f0f0";
    parcelasInput.disabled = true;
    parcelasInput.style.color = "#f0f0f0";
    taxaInput.disabled = true;
    taxaInput.style.color = "#f0f0f0";
    botaoSimular.style.display = "none";

    const valorParcela = valorParcelado / parcelas;
    let valorFinal = 0;

    for (let i = 1; i <= parcelas; i++) {
      valorFinal = (valorFinal + valorParcela) * (1 + taxa);
    }

    const diferenca = Math.max(0, valorFinal - valorVista);

    resultado.style.display = "block";
    resultado.innerHTML = `
      <p>Valor do produto à vista: <span style="color: #81d4fa;">${formatarValor(valorVista)}</span>.</p>
      <p>Parcelamento: <span>${parcelas}</span>x de <span>${formatarValor(valorParcela)}</span> (total de <span style="color: #f44336;">${formatarValor(valorParcelado)}</span>).</p>
      <p>Aplicando <strong>${formatarValor(valorParcela)}</strong> por <strong>${parcelas}</strong> meses com rendimento você juntaria <strong style="color: #00c853;">${formatarValor(valorFinal)}</strong>.</p>
      <p class="conclusao-paciencia">
        ${diferenca > 0
          ? `Você demoraria para ter o produto, porém aplicando teria um lucro de <span style="color: #00c853;">${formatarValor(diferenca)}</span>.`
          : `Parcelar resultaria em um custo menor neste caso.`}
      </p>
    `;

    graficoContainer.style.display = "block";

    grafico = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Parcelado", "Guardando"],
        datasets: [
          {
            label: "Total Parcelado",
            data: [valorParcelado, 0],
            backgroundColor: "#f44336",
          },
          {
            label: "Valor à Vista",
            data: [0, valorVista],
            backgroundColor: "#81d4fa",
          },
          {
            label: "Diferença (Sobra)",
            data: [0, diferenca],
            backgroundColor: "#00c853",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${formatarValor(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: "Valor Total (R$)",
            },
          },
        },
      },
    });

    graficoContainer.insertAdjacentHTML('afterend', `
      <div class="div-btn-simular-paciencia">
        <button id="btn-nova-simulacao" class="btn-simular-paciencia">Nova Simulação</button>
      </div>`);

    document.getElementById("btn-nova-simulacao").addEventListener("click", () => {
      form.reset();
      resultado.innerHTML = "";
      graficoContainer.style.display = "none";
      botaoSimular.style.display = "block";

      valorVistaInput.disabled = false;
      valorVistaInput.style.color = "#000";
      valorParceladoInput.disabled = false;
      valorParceladoInput.style.color = "#000";
      parcelasInput.disabled = false;
      parcelasInput.style.color = "#000";
      taxaInput.disabled = false;
      taxaInput.style.color = "#000";

      if (grafico) grafico.destroy();

      const btnNovaSimulacao = document.getElementById("btn-nova-simulacao");
      if (btnNovaSimulacao) {
        btnNovaSimulacao.parentElement.remove();
      }
    });
  });
});
