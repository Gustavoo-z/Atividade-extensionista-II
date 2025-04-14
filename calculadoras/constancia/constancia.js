import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-constancia");
    if (!form) return;
    const resultado = document.getElementById("resultado-constancia");
    const graficoContainer = document.getElementById("graficoContainer-constancia");
    const canvas = document.getElementById("graficoConstancia");
    const botaoSimular = document.getElementById("btn-simular-constancia");
  
    let grafico;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const aporteInput = document.getElementById("investimento-constancia");
      const mesesInput = document.getElementById("duracao-constancia");
      const taxaInput = document.getElementById("taxa-constancia");

      const aporte = parseFloat(document.getElementById("investimento-constancia").value);
      const meses = parseInt(document.getElementById("duracao-constancia").value);
      const taxa = parseFloat(document.getElementById("taxa-constancia").value) / 100;
  
      if (isNaN(aporte) || isNaN(meses) || isNaN(taxa)) {
        resultado.innerHTML = `<p style="color: red;">Por favor, preencha todos os campos corretamente.</p>`;
        graficoContainer.style.display = "none";
        return;
      }

      if (aporte <= 0 || meses <= 0 || taxa < 0 || isNaN(aporte) || isNaN(meses) || isNaN(taxa)) {
        alert("Por favor, insira valores válidos.\n- Investimento > 0\n- Duração > 0\n- Taxa ≥ 0%");
        return;
      }
  
      let totalComRendimento = 0;
      let totalSemRendimento = 0;
      let valoresComRendimento = [];
      let valoresSemRendimento = [];
  
      for (let i = 1; i <= meses; i++) {
        totalComRendimento = (totalComRendimento + aporte) * (1 + taxa);
        totalSemRendimento += aporte;
  
        valoresComRendimento.push(totalComRendimento.toFixed(2));
        valoresSemRendimento.push(totalSemRendimento.toFixed(2));
      }
    
      resultado.innerHTML = `
        <p class=total-investido-constancia><strong>Total investido:</strong>&nbsp; <span>${formatarValor(totalSemRendimento)}</span></p>
        <p class=total-com-rendimento-constancia><strong>Total com rendimento:</strong>&nbsp; <span>${formatarValor(totalComRendimento)}</span></p>`;

      if(totalComRendimento > totalSemRendimento) {
        const diferenca = totalComRendimento - totalSemRendimento;

        resultado.innerHTML += `<p class="resultado-constancia">Ao investir  <span>&nbsp;${formatarValor(aporte)}&nbsp;</span> por <span>&nbsp;${meses}&nbsp;</span> meses com uma taxa de <span>&nbsp;${taxa * 100}%</span>, seu dinheiro rendeu <span>&nbsp;${formatarValor(diferenca)}</span>.</p>`;
      }
      
      botaoSimular.style.display = "none";

      resultado.innerHTML += `
      <div class="div-btn-simular-constancia">
        <button id="btn-nova-simulacao" class="btn-simular-constancia"">Nova Simulação</button>
      </div>`;

      aporteInput.disabled = true;
      aporteInput.style.color = "#f0f0f0";
      mesesInput.disabled = true;
      mesesInput.style.color = "#f0f0f0";
      taxaInput.disabled = true;
      taxaInput.style.color = "#f0f0f0";

    document.getElementById("btn-nova-simulacao").addEventListener("click", () => {
      form.reset();
      resultado.innerHTML = "";
      graficoContainer.style.display = "none";
      botaoSimular.style.display = "block";
      aporteInput.disabled = false;
      aporteInput.style.color = "#000";
      mesesInput.disabled = false;
      mesesInput.style.color = "#000";
      taxaInput.disabled = false;
      taxaInput.style.color = "#000";
      if (grafico) grafico.destroy();
    });
  
      graficoContainer.style.display = "block";
  
      if (grafico) {
        grafico.destroy();
      }
  
      grafico = new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: Array.from({ length: meses }, (_, i) => `Mês ${i + 1}`),
          datasets: [
            {
              label: "Sem Investimento",
              data: valoresSemRendimento,
              borderColor: "#888",
              backgroundColor: "#8884",
              fill: false,
            },
            {
              label: "Com Investimento",
              data: valoresComRendimento,
              borderColor: "#00c853",
              backgroundColor: "#00b140",
              fill: false,
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
                  label: function(context) {
                    const valor = Number(context.raw).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2
                    });
                    return `${context.dataset.label}: ${valor}`;
                  }
                }
              }
            },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Valor (R$)",
              },
            },
          },
        },
      });
    });
  });
