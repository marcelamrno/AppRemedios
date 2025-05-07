const loginScreen = document.getElementById("loginScreen");
const mainScreen = document.getElementById("mainScreen");
const nomeUsuarioSpan = document.getElementById("nomeUsuario");
const listaRemedios = document.getElementById("listaRemedios");
const alarmes = [];

function fazerLogin() {
  const nome = document.getElementById("nomeInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  if (nome && email) {
    nomeUsuarioSpan.textContent = nome;
    loginScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
  } else {
    alert("Preencha todos os campos para entrar.");
  }
}

function adicionarRemedio() {
  const nomeRemedio = document.getElementById("remedioInput").value.trim();
  const hora = document.getElementById("horaInput").value;
  if (nomeRemedio && hora) {
    const data = new Date().toLocaleDateString();
    const li = document.createElement("li");
    li.textContent = `[${data} - ${hora}] ${nomeRemedio}`;
    li.onclick = () => li.classList.toggle("completed");
    listaRemedios.appendChild(li);
    alarmes.push({ hora, nomeRemedio, alertado: false });
    document.getElementById("remedioInput").value = "";
    document.getElementById("horaInput").value = "";
  } else {
    alert("Digite o nome do remédio e o horário.");
  }
}

function limparConcluidos() {
  const concluidos = document.querySelectorAll("#listaRemedios li.completed");
  concluidos.forEach(item => item.remove());
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString();
  let y = 20;

  doc.text(`Relatório de Remédios Concluídos - ${dataHoje}`, 10, 10);
  const concluidos = document.querySelectorAll("#listaRemedios li.completed");
  if (concluidos.length === 0) {
    doc.text("Nenhum remédio concluído hoje.", 10, y);
  } else {
    concluidos.forEach(item => {
      doc.text(item.textContent, 10, y);
      y += 10;
    });
  }

  doc.save(`remedios_concluidos_${dataHoje}.pdf`);
}

// Checa os alarmes a cada minuto
setInterval(() => {
  const agora = new Date();
  const horaAtual = agora.toTimeString().slice(0, 5); // Formato HH:MM
  alarmes.forEach(alarme => {
    if (alarme.hora === horaAtual && !alarme.alertado) {
      alert(`Hora de tomar o remédio: ${alarme.nomeRemedio}`);
      alarme.alertado = true;
    }
  });
}, 60000); // 1 minuto
