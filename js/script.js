// Depêdemcia do tooltipe (Caixa de dúvida / Ponto de interrogação).
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    
});
(function(){
    $.ajax({
        type: 'GET',
        url: 'https://storage.googleapis.com/dito-questions/survey-responses.json',
        success: function(data) {
            listAll(JSON.parse(data));
      scrollTo }
     });    
})();


// (function(){
//     var ajax = new XMLHttpRequest();
//     ajax.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             listAll(this.response);
//         }
//     };
//     ajax.open("GET",'https://storage.googleapis.com/dito-questions/survey-responses.json', true);
//     ajax.send();
// })();

function listAll(res){
    console.log(res);
}