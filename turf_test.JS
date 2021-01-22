let temps = document.getElementById('temps');
let operation = document.getElementById('ope');
let nombre_points = document.getElementById('nombre_points');
let validation = document.getElementById('validation');

validation.addEventListener('click',valider()); 

function valider(){
    let points_renard = [1 , 1.6 , 2.5 , 4 , 6.3 , 10]
    let points_choice = _.sample(points_renard);

    
    //génération du n points
    let bbox = [-180, -90, 180, 90] ; 
    let points = turf.randomPoint(points_choice, bbox);

    if (operation = 'triangulation delaunay'){
        var cellSide = 50;
        var options = {units: 'miles'};

        var triangleGrid = turf.triangleGrid(bbox, cellSide, options);

    }

    else if (operation = 'diagramme de voronoï'){
        var voronoiPolygons = turf.voronoi(points_choice, options);
    }

    //affichage du resultat sur une carte 
    

    

}
