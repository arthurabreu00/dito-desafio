// Depêdemcia do tooltipe (Caixa de dúvida / Ponto de interrogação).
$(function () {
    $('[data-toggle="tooltip"]').tooltip();

});

// (function () {
//     fetch('https://storage.googleapis.com/dito-questions/survey-responses.json',{mode: 'no-cors'})
//     .then(res => res.json()
//     .then(data => console.log(data)));

//     }
// )();

(function () {
    // Função AJAX, para carregamentos dos dados, vindo da API.
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            dataFromAjax(JSON.parse(this.response));
        }
    };
    ajax.open("GET", 'https://proxy-dito.herokuapp.com/https://storage.googleapis.com/dito-questions/survey-responses.json', true); // Solução encontrada foi utilizar um proxy, para "burlar" as proteções de CORS.
    ajax.send();
})(); // Utilizando IIFE para auto execução da função.

function numberStores(res){
    // Função para identificar o número de lojas.

    let numberStore = 0;

    res.forEach((store,index) =>{
        if(index === 0) numberStore = store.storeId; // Na primeira ocorrência determine um valor.
        if(store.storeId > numberStore) numberStore = store.storeId; // Para determinar o maior ID.
    }); 


    return numberStore;
 
} // Fim da função numberStores.

function separationStores(res){
    // Função para a separação das lojas de um unico array/object simples , para um array bi-dimensional..
    let stores = [];
    
    for(let i = 0; i < numberStores(res);i++){
        let store = res.filter(data => data.storeId == (i+1));
        stores.push(store);
    }

    return stores;
} // Fim da função separationStores.

addEventListenerAll = (scope,ev,fn) => ev.split(',').forEach(e => scope.addEventListener(e,fn)); 
// Função para adicionar diversões listener, ao mesmo tempo (Poderia ter feito com o prototype, seria o correto).

function searchBar(res){
// Função para o funcionamento da barra de pesquisas das lojas (pelo nome).

    let form = document.querySelector('.form-group')
    let input = document.querySelector('.form-control');

    let stores = separationStores(res);

    createTr(stores); // Primeira execução e renderização.

    addEventListenerAll(form,'keyup,submit',()=>{
        
        // Utilizando Regex, com a flag global e ignore case.
        let search = new RegExp(input.value,'gi'); 
        let result = res.filter(data => data.storeName.match(search));  
        // Caso encontre resquícios do nome da frase, os junte em um array.

        stores = separationStores(result); // Separação das lojas, devido ao novo array.

        for (let index = 0; index < stores.length; index++) {
            if(stores[index] == ''){
                stores.splice(index,1);
            }  
        } // Caso o alguma posição, retorne vazio, o elimine, para evitar bugs.

        createTr(stores); // Renderizar a tabela.
    }) // Fim do evento listener

} // Fim da função searchBar.


function dataFromAjax(res) {

    // Função carregado logo apos o fim do ajax.
    searchBar(res);
    editStatus({
        length: res.length, // Número de avaliações.
        rating: rating(res) // Resultados estatísticos de cada avaliação.
    });
} // Fim da função dataFromAjax.

function rating(res) {
    // Função que pecorre o objeto/array e retorna o número de ocorrências de cada avaliação.
    let excellent = veryGood = fair = bad = horrible = 0;

    for (i in res) {
        switch (res[i].score) {
            case 5:
                excellent++;
                break;
            case 4:
                veryGood++;
                break;

            case 3:
                fair++;
                break;

            case 2:
                bad++;
                break;

            case 1:
                horrible++;
                break;
        }
    }

    return {
        excellent,
        veryGood,
        fair,
        bad,
        horrible
    }
} // Fim da função rating.

function editStatus(status = {}) {

    let satisfaction = calculatiosatisfaction(status.rating.excellent, status.rating.veryGood, status.length); 
    // Calculo do nível da satisfação.

    let arrayStatus = [satisfaction, status.length]; // Formação de um array para renderização com os dados, na tela geral (quadrados).

    Object.keys((status.rating)).map(key => status.rating[key]).forEach(data => {
        arrayStatus.push(calculationRating(status.length, data));
    }); // Adicionando o array do calculo percentual das avaliações.

    let spans = document.querySelectorAll('.txt-status');

    spans.forEach((div, index) => {
        div.textContent = arrayStatus[index]; // Colocando de maneira simples, os resultados na tela (renderização)
    })
} // Fim da função editStatus.

calculatiosatisfaction = (excellent, veryGood, length) => (excellent + veryGood) / length * 100; 
// Calculo percentual das satisfação (excelente + muito bom)/número de avaliações * 100;

calculationRating = (length, data) => (100 * data) / length; 
// Calculo percentual das avaliações. (100 * número da opção escolhida) / número de avaliações;

function createTr(stores) {
    // Método para a renderização da tabela. 
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    stores.forEach(store => {

        let rate = rating(store);

        const tr = document.createElement('tr');
        let tdData = `
            <td scope="row" colspan="3"> <span class="circle-id"> ${store[0].storeId} </span> <span class="name-store"> ${store[0].storeName} </span>  </td>
                    
            <td> ${calculatiosatisfaction(rate.excellent,rate.veryGood,store.length)} % </td>
            <td>${store.length}</td>
            <td>${rate.excellent}</td>
            <td>${rate.veryGood}</td> 
            <td>${rate.fair}</td>
            <td>${rate.bad}</td>
            <td>${rate.horrible}</td>
            <td>
                <div class="plus">
                    <i class="fas fa-plus"></i> 
                </div>
            </td>
        `;

        tr.innerHTML += (tdData);
        tbody.appendChild(tr);
    });

} // Fim da função createTr.
