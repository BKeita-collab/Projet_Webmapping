// Here we get the HTML form element and the map 
let temps ;
let soumettre = document.getElementById("soumettre");
let operation;
let nombre_points ; 
let map = document.getElementById('map');

let lat_min ;
let lat_max ;
let lon_min ;
let lon_max ; 


let table_loop = document.getElementById("Loop_stats");
let summarize_stats=document.getElementById("summarize_stats");
let table_loop_thead_span = document.getElementById("Loop_stats_thead_span");
let summarize_stats_thead_span=document.getElementById("summarize_stats_thead_span");
let loop_time = document.getElementById('loop_time');
let points_time = document.getElementById('points_time');



//soumettre.addEventListener('click', valider()); 

// init map 
//let map;
 function initMap(long , lat){
    map = L.map("map").setView([long, lat],15);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }).addTo(map);
}; 





// The function valider will be use when the client fill in the form 
// after getting the values of the client, the function will apply 
// the appropriate spatial operation {triangle grid or voronoi diagram}
  function valider(){

    //points_renard is the array of the renard's serie 
    let points_renard = [10,16,25,40,63,100];
    
    
    operation = document.getElementById('ope').value;
    temps = document.getElementById('temps').value;
    nombre_points = document.getElementById('nombre_points').value;

    lat_min = document.getElementById('lat_min').valueAsNumber;
    lat_max = document.getElementById('lat_max').valueAsNumber;
    lon_min = document.getElementById('lon_min').valueAsNumber; 
    lon_max = document.getElementById('lon_max').valueAsNumber; 

    console.log(lat_max+lat_min +  lon_min+ lon_max);

    //filling in the operation on the head of the table 
    table_loop_thead_span.innerHTML = operation;
    summarize_stats_thead_span.innerHTML = operation;

    // call initMap()
    initMap((lon_max+lon_min)/2, (lat_min+lat_max)/2); 


    //nb_boucle counts the number of loop execution
    nb_boucle=1;

    // get the number of points at the end 
    let somme_points = 0; 

    // Array of graphs element
        // Array of time 
    array_time = Array();

        // Array of time 
    array_points = Array();

        // Array of time 
    array_loop = Array();

    // Bounding Box 
    let bb = Array();
    bb = [lat_min, lon_min,lat_max, lon_max];
    


    //get t0 the begining time
    let t0 = performance.now();
    let t1 = performance.now() + 1; 

    //execution time 
    exec_time = t1-t0;

   

    while((t1-t0) < temps) {
        let points_choice = 0;
        if (operation == 'triangulation delaunay'){

            //Points parameter 
            let cellSide = 50;
            let options = {bbox : bb};
            let option = {units: 'miles'};

            //points_choice is the array of the renard's serie choising by random function
            points_choice = points_renard[Math.floor(Math.random() * points_renard.length)];
            console.log("choice "+points_choice);


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
        else if (operation == 'diagramme de Voronoï'){

            //Points parameter 
            let cellSide = 50;
            let options = {bbox : bb};
            let option = {units: 'miles'};

            //points_choice is the array of the renard's serie choising by random function
            points_choice = points_renard[Math.floor(Math.random() * points_renard.length)];

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


            //Voronoï Grid creation 
            let Voronoi_Grid = turf.voronoi(points, options);
            console.log(Voronoi_Grid);

            // join the values of the points to the grid
            let count = turf.collect(Voronoi_Grid, points, "z", "z");

            L.geoJson(Voronoi_Grid).addTo(map);
            //L.geoJson(Voronoi_Grid).addTo(map); 
        }

        //filling out the table loop stats row
        let row = table_loop.insertRow();

        //filling out the table loop cell 
        let nombre_renard_choisi =  row.insertCell(0); 
        let temps_avant_execution = row.insertCell(1); 
        let temps_apres_execution = row.insertCell(2); 
        let duree_execution = row.insertCell(3);

            // get the random choice in points_renard into the table 
        nombre_renard_choisi.innerHTML = points_choice;

        //Loop incremention
            // get t0 value into  the table
        temps_avant_execution.innerHTML = t0;
        
        t0=t1;
        t1 = performance.now();

            //get t1 value into the table 
        temps_apres_execution.innerHTML = t1;

            // get the duration of the loop into the table
        duree_execution.innerHTML = t1-t0;

        // Append the new value to the arrays 
        array_loop.push(nb_boucle); 
        array_points.push(points_choice); 
        array_time.push(t1-t0);

        somme_points += points_choice; 
        nb_boucle++;
        exec_time += t1-t0; 
        
    }

    let summarize = summarize_stats.insertRow(); 

    let nb_point_entree = summarize.insertCell(0);
    let temps_max_traitement = summarize.insertCell(1); 
    let nb_boucle_effectuee = summarize.insertCell(2); 
    let duree_total_exec = summarize.insertCell(3); 
    let nombre_total_points = summarize.insertCell(4);
    
    nb_point_entree.innerHTML = nombre_points;
    temps_max_traitement.innerHTML = temps; 
    nb_boucle_effectuee.innerHTML = nb_boucle;
    duree_total_exec.innerHTML = exec_time;
    nombre_total_points.innerHTML = somme_points; 

   
    Plotly.plot( loop_time, [{
        x: array_time,
        y: array_loop }], layout = {
            title: 'loop by time',
            showlegend: true 
        }, {showSendToCloud:true} );

    //Plotting points_time
    Plotly.plot( points_time, [{
        x: array_time,
        y: array_points }], layout = {
            title: 'Points by time',
            showlegend: true
        }, {showSendToCloud:true} );
} 

