import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pequenos");
  const resultado = document.getElementById("resultado-pequenos");
  const canvas = document.getElementById("grafico-pequenos");
  const graficoContainer = document.getElementById("graficoContainer-pequenos");

  let grafico;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valorInput = document.getElementById("valor-pequenos");
    const freqInput = document.getElementById("frequencia-pequenos");
    const taxaInput = document.getElementById("taxa-pequenos");
    
    valorInput.disabled = true;
    valorInput.style.color = "#f0f0f0";
    freqInput.disabled = true;
    freqInput.style.color = "#fff";
    freqInput.style.backgroundColor = "#888";
    taxaInput.disabled = true;
    taxaInput.style.color = "#f0f0f0";

    const valor = parseFloat(document.getElementById("valor-pequenos").value);
    const frequencia = document.getElementById("frequencia-pequenos").value;
    const taxa = parseFloat(document.getElementById("taxa-pequenos").value) / 100;

    if (valor <= 0 || isNaN(valor)) {
      resultado.innerHTML = `<p style="color: red;">Informe um valor válido.</p>`;
      return;
    }

    let vezesPorMes = frequencia === "diario" ? 30 : frequencia === "semanal" ? 4 : 1;
    const mensal = valor * vezesPorMes;

    const anos = [1, 5, 10];
    const semAplicacao = anos.map(ano => mensal * 12 * ano);
    const comAplicacao = anos.map(ano => {
      const meses = ano * 12;
      if (taxa === 0) return mensal * meses;
      const fator = (Math.pow(1 + taxa, meses) - 1) / taxa;
      return mensal * fator;
    });

    graficoContainer.style.display = "block";
    if (grafico) grafico.destroy();

    grafico = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: anos.map(a => `${a} ano${a > 1 ? 's' : ''}`),
        datasets: [
          {
            label: "Sem Aplicacao",
            data: semAplicacao,
            borderColor: "#888",
            backgroundColor: "#8884",
            fill: false,
          },
          {
            label: "Com Aplicacao",
            data: comAplicacao,
            borderColor: "#00c853",
            backgroundColor: "#00c85344",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${formatarValor(ctx.raw)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Valor acumulado (R$)" }
          }
        }
      }
    });

    resultado.style.display = "block";
    resultado.innerHTML = `
      <p><strong>Gasto total mensal:</strong> <span>${formatarValor(mensal)}</span></p>
      <p class="resultado-texto-pequenos">Veja quanto esse hábito representa ao longo do tempo:</p>
    `;

    anos.forEach((ano, i) => {
      resultado.innerHTML += `
        <p><strong>${ano} ano${ano > 1 ? 's' : ''}</strong>:
          <span>${formatarValor(semAplicacao[i])}</span> (sem aplicar),
          <span class="com-aplicacao">${formatarValor(comAplicacao[i])}</span> (aplicando com a taxa de <span class="taxa-aplicacao">${taxa * 100}%</span>)</p>
      `;
    });

    const botaoSimular = document.getElementsByClassName("btn-simular-pequenos")[0];
    botaoSimular.style.display = "none";

    resultado.innerHTML += `
      <div class="div-btn-simular-pequenos">
        <button id="btn-nova-simulacao" class="btn-simular-pequenos">Nova Simulação</button>
      </div>`;

      document.getElementById("btn-nova-simulacao").addEventListener("click", () => {
        form.reset();
        resultado.innerHTML = "";
        graficoContainer.style.display = "none";
        botaoSimular.style.display = "block";
        valorInput.disabled = false;
        valorInput.style.color = "#000";
        freqInput.disabled = false;
        freqInput.style.color = "#000";
        freqInput.style.backgroundColor = "#fff";
        taxaInput.disabled = false;
        taxaInput.style.color = "#000";
        if (grafico) grafico.destroy();
      });

  });
});