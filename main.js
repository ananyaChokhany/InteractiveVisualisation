
const width = 700;
const height = 600;

let chart;
let chartWidth;
let chartHeight;


let xScale;
let yScale;
let selectedCategory = null;


let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4],
        svgUpdate:() => scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, 7),
        
    },
    {
        activeVerse: 2,
        activeLines: [1],

        svgUpdate:() => scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, 7),

    },
    {
        activeVerse: 2,
        activeLines: [2],
        svgUpdate:() => scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, 7),

    },
    {
        activeVerse: 2,
        activeLines: [3],
        
        svgUpdate:() => scatterPlot(businessData,205, "Median Women's Earning v/s Median Men's Earnings in Business ", 250, false,13),
    },
    {
        activeVerse: 2,
        activeLines: [4],
        svgUpdate:() => scatterPlot(medicalData,250, "Median Women's Earning v/s Median Men's Earnings in Medical Care", 250, false, 11),

    },
    {
        activeVerse: 3,
        activeLines: [1,2,3,4],
        svgUpdate:() => scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, 7),

    },
    {
        activeVerse: 4,
        activeLines: [1,2,3,4],
        svgUpdate:() => scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, 7),

    

    },
    {
        activeVerse: 5,
        activeLines: [1,2,3,4],
        svgUpdate:() => scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, 7),

        
    },
    {
        activeVerse: 6,
        activeLines: [1,2,3,4],
        svgUpdate:() => scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, 7),

        
        
    },
    {
        activeVerse: 7,
        activeLines: [1,2,3,4],
       
        
    }

]


let svg = d3.select("#svg");
let keyframeIndex = 0;
let selectedDotCount = 200










document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);






async function loadData() {
    
    await d3.json("business.json").then(data => {
        businessData = data;
    });

    await d3.json("medical.json").then(data => {
        medicalData = data;
    });

    await d3.json("general.json").then(data => {
        generalData = data;
    });
}


async function initialise() {

    await loadData();
    initialiseSVG();
    drawKeyframe(keyframeIndex);
}




function scatterPlot(data, value, title, legendh, check, dotCount){
   

svg.selectAll("*").remove();


const margin = { top: 30, right: 30, bottom: 50, left: 50 };
let chartWidth = width - margin.left - margin.right - 100;
let chartHeight = height - margin.top - margin.bottom;


let chart = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Women)])
    .nice()
    .range([0, chartWidth]);


const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Men)])
    .nice()
    .range([chartHeight, 0]);






    svg.append("text")
    .attr("id", "chart-title")
    .attr("x", width/2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("fill", "darkblue")
    .text(title);


    svg.selectAll("circle")
    .data(data.slice(0, dotCount)) 
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.Women + value))
    .attr("cy", d => yScale(d.Men - value))
    .attr("r", d => 700 / d.Percentage)
    .attr("fill", d => d.colour)
    .on("click", function (event, d) {

        if(keyframes[keyframeIndex].activeVerse ==3 ){
       
        handleDotClick(data,d.Occupation);
        }
    })
    .on("mouseover", function (event, d) {
      svg.append("text")
        .attr("class", "occupation-label")
        .attr("x", xScale(d.Women + value - 480))
        .attr("y", yScale(d.Men - value) - 10)
        .text(d.Occupation);
    })
    .on("mouseout", function () {
      svg.selectAll(".occupation-label").remove();
    });

    chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text");

    chart.append("text")
    .attr("class", "x-axis-label")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 40) 
    .style("text-anchor", "middle")
    .text("Median Women's Earnings");

    chart.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -chartHeight / 2) 
    .attr("y", -37.5)
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .attr("transform", "rotate(-90)") 
    .text("Median Men's Earnings");



chart.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale))
    .selectAll("text")


     if ( check){
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (chartWidth + 60) + "," + (chartHeight-legendh)  + ")");


    const legendItems = legend.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");

    legendItems.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => d.colour)
        

    legendItems.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .text(d => d.Occupation)
        .style("font-size", "15px");
     }

   


}


function removeDropdown(dropdownContainer) {
    if (dropdownContainer) {
        dropdownContainer.remove(); 
    }
}

function handleDotClick(data, clickedCategory) {

    svg.selectAll("circle").attr("opacity", 1.0);

    if (selectedCategory === clickedCategory) {
        selectedCategory = null;
        svg.selectAll("circle").attr("opacity", 1.0);

    } else {
        
        selectedCategory = clickedCategory;
        const dotsToHighlight = data.filter(d => d.Occupation === selectedCategory);
    
        svg.selectAll("circle")
            .filter(d => !dotsToHighlight.includes(d))
            .attr("opacity", 0.2);
    
        svg.selectAll("circle")
            .filter(d => dotsToHighlight.includes(d))
            .attr("opacity", 1.0);
    }



   
}




function forwardClicked() {
  if (keyframeIndex < keyframes.length - 1) {
    keyframeIndex++;
    drawKeyframe(keyframeIndex);
  }
}

function backwardClicked() {
    if (keyframeIndex > 0) {
        keyframeIndex--;
        drawKeyframe(keyframeIndex);
      }
}


let dropdownCreated = false; 
let rightColumn = d3.select(".right-column");
let dropdot = false;

let dropdownContainer = rightColumn.append("div")
    .classed("dropdown-container", true);


function drawKeyframe(kfi) {
    let kf = keyframes[kfi];
    resetActiveLines();
    updateActiveVerse(kf.activeVerse);

    for (line of kf.activeLines){
        updateActiveLine(kf.activeVerse,line);
    }

    

    if(kf.activeVerse == 1 | kf.activeVerse == 2 & kf.activeLines ==1 |kf.activeVerse == 2 & kf.activeLines == 2 | kf.activeVerse == 3 | kf.activeVerse == 4 | kf.activeVerse == 5 | kf.activeVerse == 6 | kf.activeVerse == 7){
        if(dropdownCreated == true){
            removeDropdown(dropdownContainer); 

        }
        dropdownCreated = true
        rightColumn = d3.select(".right-column");
       
   
        dropdownContainer = rightColumn.append("div")
        .classed("dropdown-container", true);

       
        dropdownContainer.html(`
        <select class="line-dropdown">
            <option value="7">all</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>

        </select>
        `);

        
        let dropdown = dropdownContainer.select(".line-dropdown");

        dropdown.on("change", function () {
        let selectedOption = this.value; // Get the selected value
    


       
        selectedDotCount = parseInt(selectedOption);
        updateSVGWithSelectedDotCount(selectedDotCount);
        
  
    });

        function updateSVGWithSelectedDotCount(dotCount) {
            
         
                scatterPlot(generalData,200, "Median Women's Earning v/s Median Men's Earnings across different sectors", 180, true, selectedDotCount)
                
        }
    }   

    
    



    if(kf.activeVerse ==  2){
    
        if(kf.activeLines == 3){
            if(dropdownCreated == true){
                removeDropdown(dropdownContainer); 
    
            }
            dropdownCreated = true
            dropdot = true;
            rightColumn = d3.select(".right-column");
       
        
        dropdownContainer = rightColumn.append("div")
        .classed("dropdown-container", true);

        dropdownContainer.html(`
        <select class="line-dropdown">
            <option value="13">all</option> 
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
        </select>
        `);

      
        let dropdown = dropdownContainer.select(".line-dropdown");

        dropdown.on("change", function () {
        let selectedOption = this.value; // Get the selected value

        
        selectedDotCount = parseInt(selectedOption);
        updateSVGWithSelectedDotCount(selectedDotCount);


  
});

function updateSVGWithSelectedDotCount(dotCount) {
  
    scatterPlot(businessData,205, "Median Women's Earning v/s Median Men's Earnings in Business ", 250, false,selectedDotCount)
    
  }
}

if(kf.activeLines == 4){
    if(dropdownCreated == true){
        removeDropdown(dropdownContainer); 

    }
    dropdownCreated = true
    rightColumn = d3.select(".right-column");


    dropdownContainer = rightColumn.append("div")
.classed("dropdown-container", true);


dropdownContainer.html(`
<select class="line-dropdown">
    <option value="11">all</option> 
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
    <option value="10">10</option>

</select>
`);


let dropdown = dropdownContainer.select(".line-dropdown");

dropdown.on("change", function () {
let selectedOption = this.value;
selectedDotCount = parseInt(selectedOption);
updateSVGWithSelectedDotCount(selectedDotCount);


});

function updateSVGWithSelectedDotCount(dotCount) {

scatterPlot(medicalData,250, "Median Women's Earning v/s Median Men's Earnings in Medical Care", 250, false, selectedDotCount)

}
}
        
          
}

    
    if(kf.svgUpdate){
 
        kf.svgUpdate();
    }

    
    

}



  


function scrollLeftColumnToActiveVerse(id) {
   
    var leftColumn = document.querySelector(".left-column-content");

    var activeVerse = document.getElementById("verse" + id);

    // The getBoundingClientRect() is a built in function that will return an object indicating the exact position
    // Of the relevant element relative to the current viewport.
    // To see a full breakdown of this read the documentation here: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    var verseRect = activeVerse.getBoundingClientRect();
    var leftColumnRect = leftColumn.getBoundingClientRect();

    // Now we calculate the exact location we would like to scroll to in order to centre the relevant verse
    // Take a moment to rationalise that this calculation does what you expect it to
    var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;

    // Finally we scroll to the right location using another built in function.
    // The 'smooth' value means that this is animated rather than happening instantly
    leftColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}






// TODO write a function to reset any active lines
function resetActiveLines() {
    d3.selectAll(".line").classed("active-line" , false);
    
}

// TODO write a function to update the active verse
function updateActiveVerse(id) {
    d3.selectAll(".verse").classed("active-verse", false);

    // Update the class list of the desired verse so that it now includes the class "active-verse"
    d3.select("#verse" + id).classed("active-verse", true);

    // Scroll the column so the chosen verse is centred
    scrollLeftColumnToActiveVerse(id);
    
}

// TODO write a function to update the active line
function updateActiveLine(vid, lid) {
    // Select the correct verse
  let thisVerse = d3.select("#verse" + vid);
  // Update the class list of the relevant lines
  thisVerse.select("#line" + lid).classed("active-line", true);
}



function initialiseSVG(){

    svg.attr("width", width);
    svg.attr("height", height);

    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale = d3.scaleBand()
        .domain([])
        .range([0, chartWidth])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text("");
}






async function initialise() {
    // TODO draw the first keyframe
    await loadData();
    initialiseSVG();
 
    drawKeyframe(keyframeIndex);
   
}

initialise();