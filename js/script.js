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

(function(){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            dataFromAjax(JSON.parse(this.response));
        }
    };
    ajax.open("GET",'https://proxy-dito.herokuapp.com/https://storage.googleapis.com/dito-questions/survey-responses.json', true);
    ajax.send();
})();

function dataFromAjax(res){

    const store1 = res.filter(data => data.storeId === 1);
    const store2 = res.filter(data => data.storeId === 2);
    createTr([store1,store2]);


    let excellent = veryGood = fair = bad = horrible = 0;

    for(i in res){
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

    editStatus({
        length : res.length,
        rating:{
            excellent,
            veryGood,
            fair,
            bad,
            horrible
        }
   
    });



}

function editStatus(status = {}){

    let satisfaction = calculatiosatisfaction(status.rating.excellent,status.rating.veryGood,status.length);
    let arrayStatus = [satisfaction,status.length];
    
    Object.keys((status.rating)).map(key => status.rating[key]).forEach(data =>{
        arrayStatus.push(calculationRating(status.length,data));
    });

    let spans = document.querySelectorAll('.txt-status');

    spans.forEach((div,index) =>{
        div.textContent = arrayStatus[index] ;
    })
} 

calculatiosatisfaction = (excellent,veryGood,length) => (excellent+veryGood)/ length * 100;

calculationRating = (length,data) =>  (100*data)/length;    

function createTr(stores){


    stores.forEach(store =>{


    console.log(store)

    const tr = document.createElement('tr');
    let tdData = `
        <td scope="row" colspan="3"> <span class="circle-id"> ${store[0].storeId} </span> <span class="name-store"> ${store[0].storeName} </span>  </td>
                
        <td> $21 </td>
        <td>14</td>
        <td>90</td>
        <td>5</td> 
        <td>5</td>
        <td>0</td>
        <td>0</td>
        <td>
            <div class="plus">
                <i class="fas fa-plus"></i> 
            </div>
        </td>
    `;

    tr.innerHTML += (tdData);

    listAll(tr);

    });


}

function listAll(tr){
    const tbody = document.querySelector('tbody');
    tbody.appendChild(tr);

}