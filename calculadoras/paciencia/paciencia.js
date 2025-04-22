import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-paciencia");
  const resultado = document.getElementById("resultado-paciencia");
  const canvas = document.getElementById("grafico-paciencia");
  const graficoContainer = document.getElementById("graficoContainer-paciencia");

  let grafico;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valorProduto = parseFloat(document.getElementById("valor-produto").value);
    const parcelas = parseInt(document.getElementById("parcelas").value);
    const valorParcela = parseFloat(document.getElementById("valor-parcela").value);
    const taxa = parseFloat(document.getElementById("taxa-paciencia").value) / 100;

    if (valorProduto <= 0 || parcelas <= 0 || valorParcela <= 0 || isNaN(taxa)) {
      resultado.innerHTML = `<p style='color:red;'>Preencha todos os campos corretamente.</p>`;
      return;
    }

    const totalParcelado = parcelas * valorParcela;

    // Calcular quantos meses levaria para juntar o valor à vista aplicando o valor da parcela mensalmente
    let mesesNecessarios;
    if (taxa === 0) {
      mesesNecessarios = Math.ceil(valorProduto / valorParcela);
    } else {
      const numerador = Math.log(1 + (valorProduto * taxa) / valorParcela);
      const denominador = Math.log(1 + taxa);
      mesesNecessarios = Math.ceil(numerador / denominador);
    }

    const totalGuardando = valorParcela * mesesNecessarios;
    const diferenca = totalParcelado - totalGuardando;

    resultado.style.display = "block";
    resultado.innerHTML = `
      <p><strong>Valor do produto à vista:</strong> ${formatarValor(valorProduto)}</p>
      <p><strong>Total pago parcelando:</strong> ${formatarValor(totalParcelado)}</p>
      <p><strong>Meses para juntar aplicando:</strong> ${mesesNecessarios} meses</p>
      <p><strong>Total guardando esse valor mensal:</strong> ${formatarValor(totalGuardando)}</p>
    `;

    resultado.innerHTML += `
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
          data: [totalParcelado, totalGuardando],
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
