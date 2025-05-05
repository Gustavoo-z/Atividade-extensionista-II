import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cafezinho");
  const gastosLista = document.getElementById("gastos-lista");
  const resultado = document.getElementById("resultado-cafezinho");
  const graficoContainer = document.getElementById("graficoContainer-cafezinho");
  const canvas = document.getElementById("grafico-cafezinho");
  const btnAdicionarGasto = document.getElementById("btn-adicionar-gasto");

  let grafico;
  let dadosAtuais = [];
  let labelsAtuais = [];
  let duracaoAtual = 1;

  naoRemoverPrimeiroGasto();

  btnAdicionarGasto.addEventListener("click", adicionarGasto);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    iniciarSimulacao();
  });

  function adicionarGasto() {
    const totalGastosAtuais = document.querySelectorAll(".gasto-item").length;
    
    if (totalGastosAtuais >= 7) {
      return;
    }
  
    const div = document.createElement("div");
    resultado.innerHTML = "";
    div.classList.add("gasto-item");
    div.innerHTML = `
      <input type="text" placeholder="Gasto" class="input-cafezinho nome-gasto" required>
      <input type="number" placeholder="Valor (R$)" class="input-cafezinho valor-gasto" required>
      <select class="input-cafezinho frequencia-gasto">
        <option value="diario">Diário</option>
        <option value="semanal">Semanal</option>
        <option value="mensal">Mensal</option>
      </select>
      <button type="button" class="btn-remover-gasto">-</button>
    `;
    gastosLista.appendChild(div);
  
    const todosGastos = document.querySelectorAll(".gasto-item");
  
    if (todosGastos.length === 7) {
      btnAdicionarGasto.style.display = "none";
    }
  
    const botaoRemover = div.querySelector(".btn-remover-gasto");
    botaoRemover.addEventListener("click", (e) => {
      const todosGastos = document.querySelectorAll(".gasto-item");
      if (todosGastos.length > 1) {
        e.target.parentElement.remove();
      } else {
        resultado.innerHTML = `<p style="color:red;">Pelo menos um gasto deve ser mantido.</p>`;
      }
  
      if (document.querySelectorAll(".gasto-item").length < 7) {
        btnAdicionarGasto.style.display = "inline-block";
      }
    });
  }

  function iniciarSimulacao() {
    if (grafico) grafico.destroy();
    graficoContainer.style.display = "none";
    resultado.innerHTML = "";

    const nomes = Array.from(document.querySelectorAll(".nome-gasto"));
    const valores = Array.from(document.querySelectorAll(".valor-gasto"));
    const frequencias = Array.from(document.querySelectorAll(".frequencia-gasto"));
    duracaoAtual = parseInt(document.getElementById("duracao-cafezinho").value);

    if (nomes.length === 0 || valores.length === 0 || frequencias.length === 0 || isNaN(duracaoAtual) || duracaoAtual <= 0) {
      resultado.innerHTML = `<p style='color:red;'>Preencha todos os campos corretamente.</p>`;
      return;
    }

    labelsAtuais = [];
    dadosAtuais = [];

    nomes.forEach((nomeInput, index) => {
      const nome = nomeInput.value.trim();
      const valor = parseFloat(valores[index].value);
      const frequencia = frequencias[index].value;

      if (nome && valor > 0) {
        let multiplicador = 1;
        if (frequencia === "diario") multiplicador = 30;
        else if (frequencia === "semanal") multiplicador = 4;
        else if (frequencia === "mensal") multiplicador = 1;

        const gastoTotal = valor * multiplicador * duracaoAtual;
        labelsAtuais.push(nome);
        dadosAtuais.push(gastoTotal);
      }
    });

    gerarGrafico(dadosAtuais, labelsAtuais);
    bloquearFormulario();
  }

  function gerarGrafico(dados, labels) {
    graficoContainer.style.display = "block";

    grafico = new Chart(canvas.getContext("2d"), {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: dados,
          backgroundColor: [
            "#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#00c853", "#8e24aa"
          ],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              generateLabels: function(chart) {
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels(chart);
                original.forEach(label => {
                  const meta = chart.getDatasetMeta(0);
                  const item = meta.data[label.index];
                  if (item && item.hidden) {
                    label.text = label.text + " (oculto)";
                    label.font = {
                      style: "line-through"
                    };
                  } else {
                    label.font = {
                      style: "normal"
                    };
                  }
                });
                return original;
              }
            },
            onClick: (e, legendItem, legend) => {
              const index = legendItem.index;
              const meta = legend.chart.getDatasetMeta(0);
              meta.data[index].hidden = !meta.data[index].hidden;
              legend.chart.update();
              recalcularEconomia(meta);
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${formatarValor(ctx.raw)}`
            }
          }
        }
      }
    });

    recalcularEconomia(grafico.getDatasetMeta(0));
  }

  function recalcularEconomia(meta) {
    let total = 0;
    meta.data.forEach((item, idx) => {
      if (!item.hidden) {
        total += dadosAtuais[idx];
      }
    });

    resultado.innerHTML = `<p>Gasto estimado no período de ${duracaoAtual} meses: <strong>${formatarValor(total)}</strong></p>`;
  }

  function bloquearFormulario() {
    document.querySelectorAll(".nome-gasto, .valor-gasto, .frequencia-gasto").forEach(input => input.disabled = true);
    document.querySelectorAll(".btn-remover-gasto").forEach(btn => btn.disabled = true);
    document.getElementById("duracao-cafezinho").disabled = true;
    btnAdicionarGasto.style.display = "none";
    form.querySelector(".btn-simular-cafezinho[type='submit']").style.display = "none";

    graficoContainer.insertAdjacentHTML("afterend", `
      <div class="div-btn-simular-cafezinho">
        <button id="btn-nova-simulacao" class="btn-simular-cafezinho">Nova Simulação</button>
      </div>
    `);

    document.getElementById("btn-nova-simulacao").addEventListener("click", novaSimulacao);
  }

  function naoRemoverPrimeiroGasto() {
    const botaoRemover = gastosLista.querySelector(".btn-remover-gasto");
    botaoRemover.addEventListener("click", (e) => {
      const todosGastos = document.querySelectorAll(".gasto-item");
      if (todosGastos.length > 1) {
        e.target.parentElement.remove();
      } else {
        resultado.innerHTML = `<p style='color:red;'>Pelo menos um gasto deve ser mantido.</p>`;
      }
    });
  }

  function novaSimulacao() {
    form.reset();
    resultado.innerHTML = "";
    document.getElementById("duracao-cafezinho").disabled = false;
    graficoContainer.style.display = "none";
    btnAdicionarGasto.style.display = "inline-block";
    form.querySelector(".btn-simular-cafezinho[type='submit']").style.display = "inline-block";
  
    gastosLista.innerHTML = `
      <div class="gasto-item">
        <input type="text" placeholder="Gasto" class="input-cafezinho nome-gasto" required>
        <input type="number" placeholder="Valor (R$)" class="input-cafezinho valor-gasto" required>
        <select class="input-cafezinho frequencia-gasto">
          <option value="diario">Diário</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
        </select>
        <button type="button" class="btn-remover-gasto">-</button>
      </div>
    `;

    naoRemoverPrimeiroGasto();
  
    if (grafico) grafico.destroy();
    const novaSimulacaoBtn = document.getElementById("btn-nova-simulacao");
    if (novaSimulacaoBtn) novaSimulacaoBtn.parentElement.remove();
  }
});
