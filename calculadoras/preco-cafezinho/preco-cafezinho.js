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

  btnAdicionarGasto.addEventListener("click", adicionarGasto);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    iniciarSimulacao();
  });

  function adicionarGasto() {
    const div = document.createElement("div");
    div.classList.add("gasto-item");
    div.innerHTML = `
      <input type="text" placeholder="Nome do gasto" class="input-cafezinho nome-gasto" required>
      <input type="number" placeholder="Valor (R$)" class="input-cafezinho valor-gasto" required>
      <select class="input-cafezinho frequencia-gasto">
        <option value="diario">Diário</option>
        <option value="semanal">Semanal</option>
        <option value="mensal">Mensal</option>
      </select>
      <button type="button" class="btn-remover-gasto">-</button>
    `;
    gastosLista.appendChild(div);

    div.querySelector(".btn-remover-gasto").addEventListener("click", () => {
      div.remove();
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

    resultado.innerHTML = `<p><strong>Total estimado no período:</strong> ${formatarValor(total)}</p>`;
  }

  function bloquearFormulario() {
    document.querySelectorAll(".input-cafezinho").forEach(input => input.disabled = true);
    document.querySelectorAll(".btn-remover-gasto").forEach(btn => btn.disabled = true);
    btnAdicionarGasto.style.display = "none";
    form.querySelector(".btn-simular-cafezinho[type='submit']").style.display = "none";

    graficoContainer.insertAdjacentHTML("afterend", `
      <div class="div-btn-simular-cafezinho">
        <button id="btn-nova-simulacao" class="btn-simular-cafezinho">Nova Simulação</button>
      </div>
    `);

    document.getElementById("btn-nova-simulacao").addEventListener("click", novaSimulacao);
  }

  function novaSimulacao() {
    form.reset();
    resultado.innerHTML = "";
    graficoContainer.style.display = "none";
    btnAdicionarGasto.style.display = "inline-block";
    form.querySelector(".btn-simular-cafezinho[type='submit']").style.display = "inline-block";

    gastosLista.innerHTML = `
      <div class="gasto-item">
        <input type="text" placeholder="Nome do gasto" class="input-cafezinho nome-gasto" required>
        <input type="number" placeholder="Valor (R$)" class="input-cafezinho valor-gasto" required>
        <select class="input-cafezinho frequencia-gasto">
          <option value="diario">Diário</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
        </select>
        <button type="button" class="btn-remover-gasto">-</button>
      </div>
    `;

    document.querySelector(".btn-remover-gasto").addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });

    if (grafico) grafico.destroy();
    const novaSimulacaoBtn = document.getElementById("btn-nova-simulacao");
    if (novaSimulacaoBtn) novaSimulacaoBtn.parentElement.remove();
  }
});
