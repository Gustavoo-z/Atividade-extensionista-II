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
    const taxa = parseFloat(document.getElementById("taxa-paciencia").value) / 100;

    if (valorVista <= 0 || valorParcelado <= 0 || isNaN(taxa)) {
      resultado.innerHTML = `<p style='color:red;'>Preencha todos os campos corretamente.</p>`;
      return;
    }

    const opcoesParcelas = [6, 12, 18, 24, 36];
    let parcelas = null;
    let valorParcela = null;

    for (let n of opcoesParcelas) {
      const tentativa = valorParcelado / n;
      if (tentativa >= 50 && tentativa <= 1000) {
        parcelas = n;
        valorParcela = tentativa;
        break;
      }
    }

    if (!parcelas || !valorParcela) {
      resultado.innerHTML = `<p style='color:red;'>Não foi possível estimar um parcelamento realista.</p>`;
      return;
    }

    let mesesNecessarios;
    if (taxa === 0) {
      mesesNecessarios = Math.ceil(valorVista / valorParcela);
    } else {
      const numerador = Math.log(1 + (valorVista * taxa) / valorParcela);
      const denominador = Math.log(1 + taxa);
      mesesNecessarios = Math.ceil(numerador / denominador);
    }

    const totalGuardando = valorParcela * mesesNecessarios;
    const diferenca = valorParcelado - totalGuardando;

    resultado.style.display = "block";
    resultado.innerHTML = `
      <p><strong>Valor do produto à vista:</strong> ${formatarValor(valorVista)}</p>
      <p><strong>Parcelamento estimado:</strong> ${parcelas}x de ${formatarValor(valorParcela)} (total de ${formatarValor(valorParcelado)})</p>
      <p><strong>Aplicando ${formatarValor(valorParcela)} por mês:</strong> você alcançaria ${formatarValor(valorVista)} em ${mesesNecessarios} meses</p>
      <p><strong>Total aplicado nesse tempo:</strong> ${formatarValor(totalGuardando)}</p>
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
          data: [valorParcelado, totalGuardando],
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
