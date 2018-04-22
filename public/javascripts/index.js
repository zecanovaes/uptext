function sendText() {    
    var text = document.getElementById('given_text').value;    
    if (text == '')
        alert('Por favor insira um texto para a análise.');
    else {
        // show loading spinner
        document.getElementById('spinner').removeAttribute('style');

        var data = {
            text: document.getElementById('given_text').value,
            model_id: 'pt-en-conversational'
        };
    
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/lang-translator', true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var body = JSON.parse(this.response);
                    if (body.tones.length > 0) {
                        // remove info text
                        document.getElementById('info_text').setAttribute('style','display:none;');
    
                        var list = "<div class='divtable divfirst'><b>Tons detectados:</b> <table id='resultado' class='resultstb'><tbody>";
                        for (var i in body.tones)
                            list = list + "<tr ><td >" + body.tones[i].tone_name + "</td><td><div class='bar'><div class='childbar' style='width: " + body.tones[i].score * 100 + "%'>" + body.tones[i].score.toFixed(2) + "</div></div></td></tr>";
                        list = list + "</tbody></table></div><div class='divtable'><b>Tons esperados:</b> <table id='esperado' class='resultstb'><tbody><tr ><td >Alegria</td><td><div class='bar'><div class='childbar' style='width: 70%'> Maior que 0.70</div></div></td></tr><tr ><td >Hesitante</td><td><div class='bar'><div class='childbar' style='width: 60%'> Até 0.20</div></div></td></tr><tr ><td >Analítico</td><td><div class='bar'><div class='childbar' style='width: 60%'> Entre 0.50 e 0.70</div></div></td></tr></tbody></table></div>";
                        document.getElementById('result_text').innerHTML = list;
   

                    } else
                        alert('Não foi possível detectar nenhuma emoção ou tom dominante.');
                        // alert('Could not detect any dominant tone or emotion.');
                }

                

                if (this.status != 200)
                    alert('Um erro ocorreu, por favor tente mais tarde.');
                    // alert('An error occured, please try again later.');
                // hide loading spinner
                document.getElementById('spinner').setAttribute('style','display:none;');
            }    
        };
        xhttp.send(JSON.stringify(data));
    }
}