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
      <p><strong>Valor do produto à vista:</strong> ${formatarValor(valorVista)}</p>
      <p><strong>Parcelamento:</strong> ${parcelas}x de ${formatarValor(valorParcela)} (total de ${formatarValor(valorParcelado)})</p>
      <p><strong>Aplicando ${formatarValor(valorParcela)} por ${parcelas} meses com rendimento:</strong> você juntaria ${formatarValor(valorFinal)}</p>
      <p class="conclusao-paciencia">
        ${diferenca > 0
          ? `Você economizaria <strong>${formatarValor(diferenca)}</strong> aguardando.`
          : `Parcelar resultaria em um custo menor neste caso.`}
      </p>
    `;

    graficoContainer.style.display = "block";
    if (grafico) grafico.destroy();

    grafico = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Parcelado", "Guardando"],
        datasets: [{
          label: "Total pago (R$)",
          data: [valorParcelado, valorFinal],
          backgroundColor: ["#f44336", "#00c853"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${formatarValor(ctx.raw)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Valor Total (R$)" }
          }
        }
      }
    });
  });
});
