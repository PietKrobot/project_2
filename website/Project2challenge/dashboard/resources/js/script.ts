/*
    Interfaces
*/

interface IcolorRGB {
    //declaring variables and giving the type of variable
    r: number ;
    g: number ;
    b: number ;
    


}

interface Ilights {
    //declaring variables and giving the type of variable
    id: string;
    name: string;
    state: boolean;
    bri: number;
    hue: number;
    sat: number;



    
}

interface Iplugs {
    //declaring variables and giving the type of variable
    ip: string;
    id: string;
    device: string;
    name: string;
    state: boolean;
    power: number;

}

/*
    Variables
*/

    // Todo: make a variable colorRGB with the type IcolorRGB
    //       make a variable colorPicker with the type number and initialize it with -1
    //       make a variable lampen with the type an array of Ilights and initialize it with an empty array
    //       make a variable plugs with the typa an array of Iplugs and initialize it with an empty array.

    //declaring variables and giving the type of variable
    let colorRGB: IcolorRGB;
    let colorPicker: number= -1;
    let lampen: Ilights[] = [];
    let plugs: Iplugs[] = [];


/*
    Constants
    DO NOT CHANGE THIS CODE
*/

const colors = [
    {r: 0xe4, g: 0x3f, b: 0x00},
    {r: 0xfa, g: 0xe4, b: 0x10},
    {r: 0x55, g: 0xcc, b: 0x3b},
    {r: 0x09, g: 0xad, b: 0xff},
    {r: 0x6b, g: 0x0e, b: 0xfd},
    {r: 0xe7, g: 0x0d, b: 0x86},
    {r: 0xe4, g: 0x3f, b: 0x00}
];

/*
    Place information on DOM when loaded  
*/

document.addEventListener('DOMContentLoaded', (event) => {
    // Todo: Make the Colorpicker unvisible
    //       call the setColorListeners function

    let colorPickerElement = document.getElementById('choosecolor') as HTMLElement;
    colorPickerElement.style.display = "none";
    setColorListeners();

    // Toddo: call the placeShellyonDom function
    //        call the placeHueOnDom function
    placeShellyOnDom();
    placeHueOnDom();

    // Todo: if there are plugs found then call the RefreshShellyInfo function
    //       make sure the RefreshShellyInfo function is called every 10 seconds
    if (plugs != undefined) {
        RefreshShellyInfo();
        setInterval(RefreshShellyInfo, 10000);
        //console.log("Refreshed Shelly Info");
    }

    /*// Assuming a function to check if plugs are found
    function checkPlugsFound() {
    // Logic to check if plugs are found
    // For demonstration, let's assume plugsFound is a boolean variable
    return plugsFound;
    }

    // Function to refresh Shelly information
    function RefreshShellyInfo() {
    // Code to refresh Shelly information
    }

    // Function to handle the process
    function handlePlugs() {
    if (checkPlugsFound()) {
        RefreshShellyInfo(); // Call the function when plugs are found
        
        // Set interval to call RefreshShellyInfo every 10 seconds
        setInterval(RefreshShellyInfo, 10000); // 10000 milliseconds = 10 seconds
    }
    }

    // Call the handlePlugs function to initiate the process
    handlePlugs();
    */



});

/*
    Place Shelly information on the DOM and add eventlisteners
*/

async function placeShellyOnDom(): Promise<void> {

    // Todo: get the Shelly plug info by using the getShellyPlugInfo function
    //       log the info to the console
   
   console.log(getShellyPlugInfo())

    // Todo: if there are shelly plugs devices are found
    //       then loop through them and if they are 'SHPLG-S' devices then
    //       push the information to the variable plugs
    let plugStatus = await getShellyPlugInfo();
    if (plugStatus != undefined) {
        for (let key in plugStatus.devices_status) {
            if (plugStatus.devices_status[key]._dev_info.code  == 'SHPLG-S') {
                let plug : Iplugs = {
                                    ip: plugStatus.devices_status[key].wifi_sta.ip, 
                                    id: plugStatus.devices_status[key]._dev_info.id, 
                                    device: plugStatus.devices_status[key]._dev_info.code, 
                                    name: " smart plug " + (plugs.length+1), 
                                    state: plugStatus.devices_status[key].relays[0].ison ? false : true, 
                                    power: plugStatus.devices_status[key].meters[0].power};
                                    plugs.push(plug); }   
        } 
    }
    else {
        console.log("No plugs found");
    }


    // Todo: if the variable plugs contains information then
    //       loop through it and add each one as a tile in the div with id container
    //       a tile has the following structure:
    //       <div class="item">
    //          <div class="itembody">
    //              <i class="fa-solid fa-plug fa-2xl" id="plug<number of plug>"></i>
    //              <h5><device name></h5>
    //          </div>
    //          <div class="itemfooter">
    //              <div class="footerinfo">
    //                  <p>Power</p>
    //                  <p id="shellypower<number of plug>"><power info>W</p>
    //              </div>
    //              <div></div>
    //              <i class="fa-solid fa-power-off" id="onoff<number of plug>" style="color: <depending on state of plug>;"></i>
    //          </div>
    //       </div>
    //       finish off with adding eventlisteners to each power icon
    //       this uses the function setPlugState to change the status of the plug
    if (plugs != undefined) {
        for (let i = 0; i < plugs.length; i++) {
            let powerState = plugs[i].state ? "red" : "green";
            let container = document.getElementById('container') as HTMLBodyElement;
    
            // Creating the main div for each plug
            let eachPlug = document.createElement('div');
            eachPlug.classList.add("itemplugs");
            container.appendChild(eachPlug);
    
            // Creating the body of the tile
            let body = document.createElement('div');
            body.classList.add("itembody");
            eachPlug.appendChild(body);
    
            // Creating the footer of the tile
            let footer= document.createElement('div');
            footer.classList.add("itemfooter");
            eachPlug.appendChild(footer);
    
            // Creating the power icon
            let powerIcon = document.createElement('i');
            powerIcon.classList.add("fa-solid", "fa-power-off");
            powerIcon.id = "onoff" + plugs[i].id;
            powerIcon.style.color = powerState;
            footer.appendChild(powerIcon);
    
            // Creating the plug icon
            let plugIcon = document.createElement('i');
            plugIcon.classList.add("fa-solid", "fa-plug", "fa-2xl");
            plugIcon.id = "plug" + plugs[i].id;
            plugIcon.style.color = "gray";
            body.appendChild(plugIcon);
    
            // Creating the name of the device
            let deviceName = document.createElement('h5');
            deviceName.textContent = plugs[i].name;
            body.appendChild(deviceName);
    
            // Creating the power information
            let powerInfo = document.createElement('p');
            powerInfo.textContent = "Power: ";
            footer.appendChild(powerInfo);
    
            let powerInfo2 = document.createElement('p');
            powerInfo2.id = "power" + plugs[i].id;
            powerInfo2.textContent = plugs[i].power + "W";
            footer.appendChild(powerInfo2);
    
            // Adding event listener to the power icon
            powerIcon.addEventListener('click', async() =>{  
                let myString1: string = 'off';
                if (plugs[i].state == true) {
                     myString1 = 'on';
                }else if (plugs[i].state == false) {  myString1 = 'off';}

             await setPlugState("0", plugs[i].ip,myString1 )
             if (plugs[i].state== true) {powerIcon.style.color = "green"; plugs[i].state= false;
             plugIcon.style.color = "yellow"; }
             else {powerIcon.style.color = "red" ; plugIcon.style.color = "gray"; plugs[i].state= true;}})
        }
    }
    
}

/*
    Refresh the info of the shelly plugs
*/
async function RefreshShellyInfo(): Promise<void> {

    // Todo : if there is plug information in the variable plugs
    //        then loop through it and use the function GetPlugPower to get and
    //        update the power information.
    if (plugs != undefined) {
        for (let i = 0; i < plugs.length; i++) {
            let power = await GetPlugPower(plugs[i].id);
            let powerInfo = document.getElementById("power" + plugs[i].id) as HTMLBodyElement;
            powerInfo.textContent = power + "W";
        }
        console.log("Refreshed Power");
    }
    else {console.log("No refresches of power status ");}
    
    
}










/*
    Place the Philips Hue information on the DOM and add eventlisteners
*/


async function placeHueOnDom(): Promise<void> {
    
    // Todo: use the function getLampsInfo the get the information on detected
    //       Philips Hue lamps
    //       if there are lamps then iterate through them and push the information
    //       to the variable lampen.
    //       iterate through lampen and add each lamp as a tile to the div with id container
    //       a tile has the following structure:
    //       <div class="item">
    //          <div class="itembody">
    //              <i class="fa-solid fa-lightbulb fa-2xl" id="bulb<number of lamp>" style="color: <color of the lamp>;"></i>
    //              <h5><name of the lamp></h5>
    //          </div>
    //          <div class="itemfooter">
    //              <i class="fa-solid fa-palette" id="color<number of the lamp>"></i>
    //              <input type="range" min="0" max="255" class="slider" id="dimming<number of the lamp>" disabled="">
    //              <i class="fa-solid fa-power-off" id="power<number of the lamp>" style="color: <depending on state of the lamp>;"></i>
    //          </div>
    //       </div>
    //       for each palette icon a eventlistener is added that activates the colorpicker tile
    //       for each slider a eventlistener is added that uses the function setLightBri to change the brightness of the lamp
    //       for each power icon a eventlistener is added that uses the function setLightState to change the state of the lamp

    let lampInfo = await getLampsInfo();
    console.log("lampinfo", lampInfo);
    if (!lampInfo) {
        console.log("No hue info");
        return
    }

    for (let lampId in lampInfo) {
        let hueLamp = lampInfo[lampId];

        let dataLamp: Ilights = {
            id: lampId,
            name: hueLamp.name,
            state: hueLamp.state.on,
            bri: hueLamp.state.bri,
            hue: hueLamp.state.hue,
            sat: hueLamp.state.sat
        };
        lampen.push(dataLamp);

        let container = document.getElementById("container") as HTMLElement;
        let item = document.createElement("div");
        item.classList.add("item");

        let itemBody = document.createElement("div");
        itemBody.classList.add("itembody");
        item.appendChild(itemBody);

        let lampIcon = document.createElement("i");
        lampIcon.classList.add("fa-solid", "fa-lightbulb", "fa-2xl");
        lampIcon.id = `bulb${dataLamp.id}`;
        lampIcon.style.color = `hsl(${(360 * dataLamp.hue) / 65535},${(100 * dataLamp.sat) / 254}%,${(100 * dataLamp.bri) / 254}%)`;
        itemBody.appendChild(lampIcon);

        let lampName = document.createElement("h5");
        lampName.textContent = `${dataLamp.name}`;
        itemBody.appendChild(lampName);

        let itemFooter = document.createElement("div");
        itemFooter.classList.add("itemfooter");
        item.appendChild(itemFooter);

        let paletteIcon = document.createElement("i");
        paletteIcon.classList.add("fa-solid", "fa-palette");
        paletteIcon.id = `color${dataLamp.id}`;
        itemFooter.appendChild(paletteIcon);

        let slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "255";
        slider.classList.add("slider");
        slider.id = `dimming${dataLamp.id}`;
        slider.value = `${dataLamp.bri}`;
        itemFooter.appendChild(slider);

        let powerIcon = document.createElement("i");
        powerIcon.classList.add("fa-solid", "fa-power-off");
        powerIcon.id = `power${dataLamp.id}`;
        powerIcon.style.color = dataLamp.state ? "green" : "red";
        itemFooter.appendChild(powerIcon);

        powerIcon.addEventListener("click", async () => {
            let newState = !dataLamp.state;
            let result = await setLightState(Number(dataLamp.id), newState);
            if (result) {
                dataLamp.state = newState;
                powerIcon.style.color = newState ? "green" : "red";
            }
        });

        paletteIcon.addEventListener("click", () => {
            colorPicker = lampen.indexOf(dataLamp);
            let colorPickerElement = document.getElementById('choosecolor') as HTMLElement;

            if (colorPickerElement.style.display === "block") {
                colorPickerElement.style.display = "none";
            }
            else {
                colorPickerElement.style.display = "block";
            }
        });

        slider.addEventListener("input", async () => {
            console.log("slider value", slider.value);
            
            dataLamp.bri = parseInt(slider.value);
            await setLightBri(Number(dataLamp.id), dataLamp.bri);
        });

        container.appendChild(item);
    }
    
            
            
};

/*
    
    Add Eventlisteners to the colorwheel to calculate the RGB values when moving the cursor
    Add Eventlisteners when color is picked by clicking on it.



    DO NOT CHANGE THIS CODE
*/

function setColorListeners(){

    (document.getElementById('color-wheel') as HTMLElement).addEventListener('mousemove', function(e) {
        var rect = (e.target as HTMLElement).getBoundingClientRect();
        // Calculate Cartesian coordinates as if the circle radius were 1
        var x = 2 * (e.clientX - rect.left) / (rect.right - rect.left) - 1;
        var y = 1 - 2 * (e.clientY - rect.top) / (rect.bottom - rect.top);
        // Calculate the angle in degrees with 0 at the top and rotate clockwise as expected by css conical gradient
        var a = ((Math.PI / 2 - Math.atan2(y, x)) / Math.PI * 180);
        if (a < 0) a += 360;
        // Draw the angle between 0 and the number of colors in the gradient minus one
        a = a / 360 * (colors.length - 1);  // minus one because the last item is at 360°, which is the same as 0°
        // Calculate the colors to interpolate
        var a0 = Math.floor(a) % colors.length;
        var a1 = (a0 + 1) % colors.length;
        var c0 = colors[a0];
        var c1 = colors[a1];
        // Calculate the weights and interpolate colors
        var a1w = a - Math.floor(a);
        var a0w = 1 - a1w;
        colorRGB = {
            r: c0.r * a0w + c1.r * a1w,
            g: c0.g * a0w + c1.g * a1w,
            b: c0.b * a0w + c1.b * a1w
        };
        // Calculate the radius
        var r = Math.sqrt(x * x + y * y);
        if (r > 1) r = 1;
        // Calculate the white weight, interpolate, and round to a whole number
        var cw = r < 0.8 ? (r / 0.8) : 1;
        var ww = 1 - cw;
        colorRGB.r = Math.round(colorRGB.r * cw + 255 * ww);
        colorRGB.g = Math.round(colorRGB.g * cw + 255 * ww);
        colorRGB.b = Math.round(colorRGB.b * cw + 255 * ww);
    });


    (document.getElementById('color-wheel') as HTMLElement).addEventListener('click', async (): Promise<void> => {
        // Convert the chosen RGB color to HSL
        let hsl = rgbToHSB(colorRGB.r, colorRGB.g, colorRGB.b);
        console.log(lampen, colorPicker, hsl);
        lampen[colorPicker].hue = hsl.hue;
        lampen[colorPicker].bri = hsl.bri;
        lampen[colorPicker].sat = hsl.sat;
        // Setting the color on the lamp
        await setLightColor(Number(lampen[colorPicker].id), lampen[colorPicker].hue, lampen[colorPicker].bri, lampen[colorPicker].sat);
        // Adjust the information on the DOM
        (document.getElementById("bulb" + lampen[colorPicker].id) as HTMLElement).style.color = "hsl(" + (360 * lampen[colorPicker].hue / 65535) + "," + (100 * lampen[colorPicker].sat / 254) + "%," + (100 * lampen[colorPicker].bri / 254) + "%)";
        (document.getElementById("dimming" + lampen[colorPicker].id) as HTMLFormElement).value = lampen[colorPicker].bri;
        // deactivate colorpicker again
        colorPicker = -1;
        (document.getElementById('choosecolor') as HTMLElement).style.display = "none";
    });
}
