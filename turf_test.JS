let temps = document.getElementById('temps');
let operation = document.getElementById('ope');
let nombre_points = document.getElementById('nombre_points');
let validation = document.getElementById('validation');

validation.addEventListener('click',valider()); 

function valider(){
    
    //génération du n points
    let points = turf.randomPoint(nombre_points, {bbox: [-180, -90, 180, 90]});

    //affichage du resultat sur une carte 
    

    

}
