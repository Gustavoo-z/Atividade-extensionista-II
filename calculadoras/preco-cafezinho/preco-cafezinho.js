import { formatarValor } from "../../script.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cafezinho");
  const gastosLista = document.getElementById("gastos-lista");
  const resultado = document.getElementById("resultado-cafezinho");
  const graficoContainer = document.getElementById("graficoContainer-cafezinho");
  const canvas = document.getElementById("grafico-cafezinho");
  const btnAdicionarGasto = document.getElementById("btn-adicionar-gasto");

  let grafico;

  btnAdicionarGasto.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("gasto-item");
    div.innerHTML = `
      <input type="text" placeholder="Nome do gasto" class="input-cafezinho nome-gasto" required>
      <input type="number" placeholder="Valor (R$)" class="input-cafezinho valor-gasto" required>
      <button type="button" class="btn-remover-gasto">-</button>
    `;
    gastosLista.appendChild(div);

    div.querySelector(".btn-remover-gasto").addEventListener("click", () => {
      div.remove();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (grafico) grafico.destroy();
    graficoContainer.style.display = "none";
    resultado.innerHTML = "";

    const nomes = Array.from(document.querySelectorAll(".nome-gasto"));
    const valores = Array.from(document.querySelectorAll(".valor-gasto"));
    const duracao = parseInt(document.getElementById("duracao-cafezinho").value);
    const taxa = parseFloat(document.getElementById("taxa-cafezinho").value) / 100;

    if (nomes.length === 0 || valores.length === 0 || isNaN(duracao) || duracao <= 0) {
      resultado.innerHTML = `<p style='color:red;'>Preencha todos os campos corretamente.</p>`;
      return;
    }

    let totalGastoMensal = 0;
    let labels = [];
    let dados = [];

    nomes.forEach((nomeInput, index) => {
      const nome = nomeInput.value.trim();
      const valor = parseFloat(valores[index].value);

      if (nome && valor > 0) {
        labels.push(nome);
        dados.push(valor);
        totalGastoMensal += valor;
      }
    });

    const totalGasto = totalGastoMensal * duracao;

    let totalComRendimento = 0;
    for (let i = 1; i <= duracao; i++) {
      totalComRendimento = (totalComRendimento + totalGastoMensal) * (1 + taxa);
    }

    resultado.innerHTML = `
      <p><strong>Total gasto no período:</strong> ${formatarValor(totalGasto)}</p>
      <p><strong>Se aplicado mensalmente:</strong> ${formatarValor(totalComRendimento)}</p>
    `;

    graficoContainer.style.display = "block";

    grafico = new Chart(canvas.getContext("2d"), {
      type: "pie",
      data: {
        labels: [...labels, "Economia com Investimento"],
        datasets: [{
          data: [...dados, totalComRendimento - totalGasto],
          backgroundColor: [
            "#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#00c853"
          ],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${formatarValor(ctx.raw)}`
            }
          }
        }
      }
    });

    // Bloqueia o form e mostra "Nova Simulação"
    document.querySelectorAll(".input-cafezinho").forEach(input => input.disabled = true);
    document.querySelectorAll(".btn-remover-gasto").forEach(btn => btn.disabled = true);
    btnAdicionarGasto.style.display = "none";
    form.querySelector(".btn-simular-cafezinho[type='submit']").style.display = "none";

    graficoContainer.insertAdjacentHTML("afterend", `
      <div class="div-btn-simular-cafezinho">
        <button id="btn-nova-simulacao" class="btn-simular-cafezinho">Nova Simulação</button>
      </div>
    `);

    document.getElementById("btn-nova-simulacao").addEventListener("click", () => {
      form.reset();
      resultado.innerHTML = "";
      graficoContainer.style.display = "none";
      btnAdicionarGasto.style.display = "inline-block";
      form.querySelector(".btn-simular-cafezinho[type='submit']").style.display = "inline-block";

      gastosLista.innerHTML = `
        <div class="gasto-item">
          <input type="text" placeholder="Nome do gasto" class="input-cafezinho nome-gasto" required>
          <input type="number" placeholder="Valor (R$)" class="input-cafezinho valor-gasto" required>
          <button type="button" class="btn-remover-gasto">-</button>
        </div>
      `;

      document.querySelector(".btn-remover-gasto").addEventListener("click", (e) => {
        e.target.parentElement.remove();
      });

      if (grafico) grafico.destroy();
      const novaSimulacaoBtn = document.getElementById("btn-nova-simulacao");
      if (novaSimulacaoBtn) novaSimulacaoBtn.parentElement.remove();
    });
  });
});
