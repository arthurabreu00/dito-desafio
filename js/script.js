// Depêdemcia do tooltipe (Caixa de dúvida / Ponto de interrogação).
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

(function initEvents(){

    // Ao colocar o mouse
    document.querySelector('.table').addEventListener('mouseover',e =>{
        let nameStoreEl = e.target.parentNode.querySelector('.name-store');
        // let tdNameStorageEl = e.target.parentNode.parentNode.querySelector('.name-store');


        // Caso exista o elemento procurado.
        if(nameStoreEl || tdNameStorageEl){
            nameStoreEl.style.color = '#A6E0BE';
        };
    });

    // Ao retirar o mouse 
    document.querySelector('.table').addEventListener('mouseout',e =>{

        let nameStoreEl = e.target.parentNode.querySelector('.name-store');
        let tdNameStorageEl = e.target.parentNode.parentNode.querySelector('.name-store');


        if(nameStoreEl || tdNameStorageEl ){
            nameStoreEl.style.color = '#000';
        }
     });
    
})();