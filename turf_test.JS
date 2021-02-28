// Here we get the HTML form element and the map 
let temps ;
let soumettre = document.getElementById("soumettre");
let operation;
let nombre_points ; 
let map = document.getElementById('map');

//soumettre.addEventListener('click', valider()); 

// init map 
//let map;
 function initMap(){
    map = L.map("map").setView([48.84117832521629, 2.587312869080921],15);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }).addTo(map);
}; 


 // call initMap()
initMap(); 


// The function valider will be use when the client fill in the form 
// after getting the values of the client, the function will apply 
// the appropriate spatial operation {triangle grid or voronoi diagram}
  function valider(){
    
    //get t0 the begining time
    let t0 = performance.now();
    let t1 = performance.now() + 1; 

    //points_renard is the array of the renard's serie choising by random function
    let points_renard = [1 , 1.6 , 2.5 , 4 , 6.3 , 10]
    let points_choice = points_renard[Math.floor(Math.random() * points_renard.length)];
    
    operation = document.getElementById('ope').value;
    temps = document.getElementById('temps').value;
    nombre_points = document.getElementById('nombre_points').value;

    //nb_boucle counts the number of loop execution
    nb_boucle=1;

    while((t1-t0) < temps) {
        console.log('t1-t0: '+(t1-t0));
        if (operation == 'triangulation delaunay'){

            //Points parameter 
            let cellSide = 50;
            let options = {bbox : [2.581848140659056, 48.84129132448065 ,2.5872163116428157, 48.84296821335873]};
            let option = {units: 'miles'};

            // generate points into the bbox range[min_lat, min_long, max_lat, max_long] and
            let points = turf.randomPoint(points_choice, options);
            L.geoJson(points).addTo(map);

            //Formating the style of the points 
            let pointStyle = {
                pointToLayer: function(feature, latlng){
                    return L.circle(latlng);
                },
                style: {
                    "color": "#ff7800",
                    "weight": 5,
                    "opacity": 0.65
                }
            }

            
            // This fonction attributes the color from the features properties 
            function getColor(d) {
                return d > 50 ? '#800026' :
                    d > 30  ? '#BD0026' :
                    d > 25  ? '#E31A1C' :
                    d > 20  ? '#FC4E2A' :
                    d > 15   ? '#FD8D3C' :
                    d > 10   ? '#FEB24C' :
                    d > 5  ? '#FED976' :
                                '#FFEDA0';
            }

            
            //formating the style of the triangle grids using the function getColor and others parameters
            let crimeGridStyle = {
                style: function style(feature) {
                return {
                    fillColor: getColor(feature.properties.z),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
            }

            // create a "z" value for each point up to 50
            points.features.forEach(function(d){
                d.properties.z = ~~(Math.random() * 50);
            });

            //Display the points on the map
            L.geoJson(points, pointStyle).addTo(map);

            //TriangleGrid creation 
            let cellWidth = 0.5;
            let options1={units : 'kilometers'};
            let triGrid = turf.triangleGrid(options.bbox, cellWidth, options1);

            // join the values of the points to the grid
            let count = turf.collect(triGrid, points, "z", "z")
            console.log(count);

            L.geoJson(count, crimeGridStyle).addTo(map);
        }

    
        else if (operation == 'diagramme de voronoï'){
    
            /*let voronoiPolygons = turf.voronoi(points_choice, options);

            let points = turf.randomPoint(100, options);
            let voronoiPolygons = turf.voronoi(points, options);*/

            
        }
    
        else if (operation == 'triangulation simple'){
    
            // add a random property to each point between 0 and 9
            for (var i = 0; i < points.features.length; i++) {
            points.features[i].properties.z = ~~(Math.random() * 9);
            }
            var tin = turf.tin(points, 'z');
            }
        
        //Loop incremention
        console.log('t1 before execution: '+t1)
        t0=t1
        t1 = performance.now() 
        console.log('t1 after execution: '+t1)
        nb_boucle++;
        
    }
    console.log('nombre de boucle= '+nb_boucle);
} 

