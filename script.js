
let formulario = document.getElementById('adicionarTarefa');

//Referências das listas principais
let listaAFazer = document.getElementById('listaAFazer');
let listaRealizadas = document.getElementById('listaRealizadas');

//Faz com que o texto passe a ser apenas letras de a-z e números 0-9
function normalizarTexto(texto) {
    return texto.trim().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^\w\s]|_/g, "")      // Remove pontuação
        .replace(/\s/g, "");             // Remove espaços
}
//Verifica se a tarefa já existe
function tarefaJaExiste(valor){

    //Compara se já não foi colocado isso, se sim, já para aqui
    let itensAtuais = Array.from(document.querySelectorAll('#listaAFazer label, #listaRealizadas label'))
                            .map(li => normalizarTexto(li.textContent));
    
    if (itensAtuais.includes(normalizarTexto(valor))) {
            alert("Esse item já foi adicionado!");
            return true; // tarefa duplicada
        }
    return false; // tarefa ainda não existe
};

//Cria os elementos da tarefa
function criarTarefa(valor) {

    //Cria o checkbox para podermos mudar de lista
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = normalizarTexto(valor); // tira todos os espaços do texto antes de adicionar ao id
    checkbox.name = valor;
    checkbox.value = valor;

    //cria o label que permite marcar a checkbox clicando no texto
    let label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.className = "riscado";
    label.appendChild(document.createTextNode(valor));

    //cria o botão que permite apagar a tarefa
    let botao = document.createElement('button');
    botao.innerText = "Apagar tarefa";
    botao.name = valor;
    botao.id = 'btn'+valor.replace(/\s/g, '');
    botao.type = 'button';

    //cria um novo elemento em li
    let novaLi = document.createElement('li');
    novaLi.appendChild(checkbox);
    novaLi.appendChild(label);
    novaLi.appendChild(botao);

    //Retorna as referências dos elementos criados
    return {checkbox, botao, novaLi};
};


//Configura os eventos da tarefa
function configurarEventosDaTarefa(elementos){
    let {checkbox, botao, novaLi} = elementos;


    //verifica se a checkbox está marcada ou não e encaminha a tarefa pra lista correta, se estiver marcada para tarefas finalizadas
    checkbox.addEventListener('change', (event) => {
        if (event.target.checked){
            listaRealizadas.appendChild(novaLi);
        } else {
            listaAFazer.appendChild(novaLi);
        }
    });

    //Faz o botão de remover funcionar
    botao.addEventListener('click', () => {
        novaLi.remove();
    });
};

formulario.addEventListener('submit', function(e){
    //faz com que a ação esperada do formulário (recarregar a página) não aconteça
    e.preventDefault();
    
    //Pega o valor do input
    let input = document.getElementById('tarefa');
    let valor = input.value.trim();

    //Checa se está vazio, se estiver já para aqui
    if (valor === "") return;

    //Compara se já não foi colocado isso, se sim, já para aqui também
    if (tarefaJaExiste(valor)) return;
        
    
    // Criamos os elementos e guardamos as referências
    let tarefaCriada = criarTarefa(valor);

    //adiciona o li à lista ul
   listaAFazer.appendChild(tarefaCriada.novaLi);

    //realiza os eventos
    configurarEventosDaTarefa(tarefaCriada);

    //limpa o input e foca nele novamente
    input.value = "";
    input.focus();

});
