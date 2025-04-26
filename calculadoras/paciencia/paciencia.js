import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-paciencia");
  const resultado = document.getElementById("resultado-paciencia");
  const canvas = document.getElementById("grafico-paciencia");
  const graficoContainer = document.getElementById("graficoContainer-paciencia");

  let grafico;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valorVista = parseFloat(document.getElementById("valor-vista").value);
    const valorParcelado = parseFloat(document.getElementById("valor-parcelado").value);
    const parcelas = parseInt(document.getElementById("qtd-parcelas").value);
    const taxa = parseFloat(document.getElementById("taxa-paciencia").value) / 100;

    if (
      valorVista <= 0 ||
      valorParcelado <= 0 ||
      isNaN(parcelas) ||
      parcelas <= 0 ||
      isNaN(taxa)
    ) {
      resultado.innerHTML = `<p style='color:red;'>Preencha todos os campos corretamente.</p>`;
      return;
    }

    const valorParcela = valorParcelado / parcelas;

    let valorFinal = 0;
    for (let i = 1; i <= parcelas; i++) {
      valorFinal = (valorFinal + valorParcela) * (1 + taxa);
    }

    const diferenca = valorFinal - valorVista;

    resultado.style.display = "block";
    resultado.innerHTML = `
      <p>Valor do produto à vista: <span>${formatarValor(valorVista)}</span>.</p>
      <p>Parcelamento: <span>${parcelas}</span>x de <span>${formatarValor(valorParcela)}</span> (total de <span>${formatarValor(valorParcelado)}</span>).</p>
      <p>Aplicando <strong>${formatarValor(valorParcela)}</strong> por <strong>${parcelas}</strong> meses com rendimento você juntaria <strong>${formatarValor(valorFinal)}</strong>.</p>
      <p class="conclusao-paciencia">
        ${diferenca > 0
          ? `Você demoraria para ter o produto, porém aplicando teria um lucro de <span>${formatarValor(diferenca)}</span>.`
          : `Parcelar resultaria em um custo menor neste caso.`}
      </p>
    `;

    graficoContainer.style.display = "block";
    if (grafico) grafico.destroy();

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
            data: [0, Math.max(0, valorFinal - valorVista)],
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
          x: {
            stacked: true,
          },
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
  });
});
