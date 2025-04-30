import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-peso");
  const resultado = document.getElementById("resultado-peso");
  let grafico = null;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    document.querySelector(".resultado-peso").style.display = "block";

    const valor = parseFloat(document.getElementById("valor-peso").value);
    const parcelas = parseInt(document.getElementById("parcelas-peso").value);
    const taxa = parseFloat(document.getElementById("taxa-peso").value) / 100;

    if (isNaN(valor) || isNaN(parcelas) || isNaN(taxa) || valor <= 0 || parcelas <= 0 || taxa < 0) {
      resultado.innerHTML = `<p style="color: red;">Por favor, preencha todos os campos corretamente.</p>`;
      resultado.style.display = "block";
      return;
    }

    const parcelaValor = (valor * Math.pow(1 + taxa, parcelas) * taxa) / (Math.pow(1 + taxa, parcelas) - 1);

    const totalPago = parcelaValor * parcelas;
    const jurosTotal = totalPago - valor;

    resultado.innerHTML = `
      <p class="resultado-valor-original"><strong>Valor da dívida:</strong> <span>${formatarValor(valor)}</span></p>
      <p class="resultado-total-pago"><strong>Valor total pago:</strong> <span>${formatarValor(totalPago)}</span></p>
      <p class="resultado-juros"><strong>Juros pagos:</strong> <span>${formatarValor(jurosTotal)}</span></p>
      <canvas id="grafico-peso" style="max-width: 400px; margin: 20px auto;"></canvas>
    `;
    resultado.style.display = "block";

    if (grafico) grafico.destroy(); // destrói gráfico anterior

    const ctx = document.getElementById("grafico-peso").getContext("2d");
    grafico = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Valor da Dívida", "Total Pago"],
        datasets: [{
          label: "Comparativo de Valores",
          data: [valor, totalPago],
          backgroundColor: ["#00c853", "#ff5252"],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return formatarValor(context.raw);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor (R$)',
              color: 'white',
              font: { weight: 'bold' }
            },
            ticks: {
              color: 'white',
            }
          },
          x: {
            ticks: {
              color: 'white',
            }
          }
        }
      }
    });
  });
});
