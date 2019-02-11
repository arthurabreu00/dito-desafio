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
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            dataFromAjax(JSON.parse(this.response));
        }
    };
    ajax.open("GET", 'https://proxy-dito.herokuapp.com/https://storage.googleapis.com/dito-questions/survey-responses.json', true);
    ajax.send();
})();

function maxStores(res){

    let max = 0;

    res.forEach((store,index) =>{
        if(index === 0) max = store.storeId;

        if(store.storeId > max) max = store.storeId;
    });
    return max;
 
}

function separationStores(res){

    let stores = [];
    
    for(let i = 0; i < maxStores(res);i++){
        let store = res.filter(data => data.storeId == (i+1));
        stores.push(store);
        
    }

    return stores;
}

addEventListenerAll = (scope,ev,fn) => ev.split(',').forEach(e => scope.addEventListener(e,fn));

function searchBar(res){

    let form = document.querySelector('.form-group')
    let input = document.querySelector('.form-control');

    let stores = separationStores(res);

    createTr(stores);

    addEventListenerAll(form,'keyup,submit',()=>{
        
        let search = new RegExp(input.value,'gi');
        let result = res.filter(data => data.storeName.match(search));

        stores = separationStores(result);

        for (let index = 0; index < stores.length; index++) {
            if(stores[index] == ''){
                stores.splice(index,1);
            }
        }

        createTr(stores);
    })



}


function dataFromAjax(res) {


    searchBar(res);

    editStatus({
        length: res.length,
        rating: rating(res)
    });
}

function rating(res) {
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
}

function editStatus(status = {}) {

    let satisfaction = calculatiosatisfaction(status.rating.excellent, status.rating.veryGood, status.length);
    let arrayStatus = [satisfaction, status.length];

    Object.keys((status.rating)).map(key => status.rating[key]).forEach(data => {
        arrayStatus.push(calculationRating(status.length, data));
    });

    let spans = document.querySelectorAll('.txt-status');

    spans.forEach((div, index) => {
        div.textContent = arrayStatus[index];
    })
}

calculatiosatisfaction = (excellent, veryGood, length) => (excellent + veryGood) / length * 100;

calculationRating = (length, data) => (100 * data) / length;

function createTr(stores) {

   

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



}
