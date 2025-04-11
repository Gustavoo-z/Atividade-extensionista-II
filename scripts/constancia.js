document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-investimento");
    const resultado = document.getElementById("resultado");
    const graficoContainer = document.getElementById("graficoContainer");
    const canvas = document.getElementById("graficoConstancia");
    const botaoSimular = document.getElementById("btn-simular");
  
    let grafico;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const aporteInput = document.getElementById("aporte");
      const mesesInput = document.getElementById("duracao");
      const taxaInput = document.getElementById("taxa");

      const aporte = parseFloat(document.getElementById("aporte").value);
      const meses = parseInt(document.getElementById("duracao").value);
      const taxa = parseFloat(document.getElementById("taxa").value) / 100;
  
      if (isNaN(aporte) || isNaN(meses) || isNaN(taxa)) {
        resultado.innerHTML = `<p style="color: red;">Por favor, preencha todos os campos corretamente.</p>`;
        graficoContainer.style.display = "none";
        return;
      }

      if (aporte <= 0 || meses <= 0 || taxa < 0 || isNaN(aporte) || isNaN(meses) || isNaN(taxa)) {
        alert("Por favor, insira valores válidos.\n- Aporte > 0\n- Duração > 0\n- Taxa ≥ 0%");
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
  
      const formatar = valor =>
        valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    
      resultado.innerHTML = `
        <p><strong>Total investido:</strong> ${formatar(totalSemRendimento)}</p>
        <p><strong>Total com rendimento:</strong> ${formatar(totalComRendimento)}</p>
      `;
      
      botaoSimular.style.display = "none";

      resultado.innerHTML += `
      <div style="margin-top: 1rem;">
        <button id="nova-simulacao" class="btn-simular">Nova Simulação</button>
      </div>
    `;

    aporteInput.disabled = true;
    aporteInput.style.color = "#f0f0f0";
    mesesInput.disabled = true;
    mesesInput.style.color = "#f0f0f0";
    taxaInput.disabled = true;
    taxaInput.style.color = "#f0f0f0";

    document.getElementById("nova-simulacao").addEventListener("click", () => {
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
              borderColor: "#007bff",
              backgroundColor: "#007bff44",
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
