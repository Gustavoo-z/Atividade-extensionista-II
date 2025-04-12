document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-meta");
    const resultado = document.getElementById("resultadoMeta");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const meta = parseFloat(document.getElementById("meta").value);
      const prazo = parseInt(document.getElementById("prazo").value);
  
      if (meta <= 0 || prazo <= 0 || isNaN(meta) || isNaN(prazo)) {
        resultado.innerHTML = "<p style='color: red;'>Digite valores válidos!</p>";
        return;
      }
  
      const mensal = meta / prazo;
  
      resultado.innerHTML = `
        <p><strong>Meta total:</strong> R$ ${meta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        <p><strong>Você precisa guardar:</strong> R$ ${mensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} por mês</p>
      `;
    });
  });
  