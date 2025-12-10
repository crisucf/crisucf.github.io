import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from "tweakpane";

$(document).ready(function(){
    $('html').css({
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    });

    var protons = 1;
    var eletrons = 1;
    var neutrons = 0;
    var carga = 0;

    const elementos = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"];
    const neutronsElemento = [0,    2,    4,    5,    6,   6,   7,   8,  10,   10,   12,   12,   14,   14,   16,  16,  18,   22,  20,   20,   24,   26,   28,  28,   30,   30,   32,   31,   35,   35,   39,   41,   42,   45,   45,   48,   48,   50,   50,  51,   52,   54,   55,   57,   58,   60,   61,   64,   66,   69,   71,   76,   74,  77,   78,   81,   82,   82,   82,   84,   84,   88,   89,   93,   94,   96,   98,   99,   100,  103,  104, 106,  108,  110,  111,  114,  115,  117,  118,  120, 123,  125,   126, 125,  125,  136,  136,  138,  138,  142,  140,  146,  144, 150,  148,  151,  150,  153,  153,  157,  157,  157,  163,  157,  157,  163,  160,  161,  169,  171,  171,  173,  173,  175,  173,   177,  177,  176];
    const raioElemento = [53,31,167,112,87,67,56,48,42,38,190,145,125,111,98,88,79,71,235,194,184,176,171,166,161,156,152,149,145,142,136,125,114,103,94,88,265,219,212,206,198,190,183,178,173,169,165,161,156,145,133,123,115,108,298,253,195,158,247,206,205,238,231,233,225,228,226,226,222,222,217,208,200,163,188,185,180,177,174,171,156,154,143,135,127,120,348,283,260,237,243,243,221,243,244,245,244,245,245,245,246,241,236,231,226,221,216,211,206,201,196,191,186,181,176,171,165,157];
    //maior Fr = 348

    function distribuirEletrons(total){
        const subniveis = [
            {camada: 1, label: '1s', max: 2},
            {camada: 2, label: '2s', max: 2},
            {camada: 2, label: '2p', max: 6},
            {camada: 3, label: '3s', max: 2},
            {camada: 3, label: '3p', max: 6},
            {camada: 4, label: '4s', max: 2},
            {camada: 3, label: '3d', max: 10},
            {camada: 4, label: '4p', max: 6},
            {camada: 5, label: '5s', max: 2},
            {camada: 4, label: '4d', max: 10},
            {camada: 5, label: '5p', max: 6},
            {camada: 6, label: '6s', max: 2},
            {camada: 4, label: '4f', max: 14},
            {camada: 5, label: '5d', max: 10},
            {camada: 6, label: '6p', max: 6},
            {camada: 7, label: '7s', max: 2},
            {camada: 5, label: '5f', max: 14},
            {camada: 6, label: '6d', max: 10},
            {camada: 7, label: '7p', max: 6},
            {camada: 8, label: '8s', max: 2},
        ];
        
        let restante = total;
        let camadas = {};

        for (let sub of subniveis){
            if(restante <= 0) break;
            let usado = Math.min(sub.max, restante);
            camadas[sub.camada] = (camadas[sub.camada] || 0) + usado;
            restante -= usado;
        }

        camadas = Object.entries(camadas).sort((a, b) => a[0] - b[0]).map(([camada, contar]) => ({camada: camada, eletrons: contar}));

        $('head style').remove();
        var i = 0;
        while(i < camadas.length){
            $("<style>.c" + (i + 1) + "::after{content: '" + camadas[i].eletrons + "';display:unset;}</style>").appendTo('head');
            i++;
        }
        return camadas;
    }
    
    $('#adcP').click(function(){
        if(protons == 118){}else{protons++; eletrons = protons; neutrons = neutronsElemento[protons - 1]}
        $('#simbolo span').html(elementos[protons - 1]);
        fazerNucleo();
        fazerEletosfera(distribuirEletrons(eletrons), distribuirEletrons(eletrons).length, raioElemento[protons -1], 0);
    });
    $('#rmvP').click(function(){
        if(protons == 1){}else{protons--; eletrons = protons; neutrons = neutronsElemento[protons - 1]}
        $('#simbolo span').html(elementos[protons - 1]);
        fazerNucleo();
        fazerEletosfera(distribuirEletrons(eletrons), distribuirEletrons(eletrons).length, raioElemento[protons -1], 0);
    });
    $('#adcE').click(function(){
        if(eletrons == protons + 5 || eletrons == 120){}else{eletrons++;}
        var carga = protons - eletrons;
        if(carga == 0){
            $('#simbolo span').html(elementos[protons - 1]);
        }else if(carga == 1){
            $('#simbolo span').html(elementos[protons - 1] + "<sup>+</sup>");
        }else if(carga == -1){
            $('#simbolo span').html(elementos[protons - 1] + "<sup>-</sup>");
        }else if(carga > 1){
            $('#simbolo span').html(elementos[protons - 1] + "<sup>+" + carga + "</sup>");
        }else{
            $('#simbolo span').html(elementos[protons - 1] + "<sup>" + carga + "</sup>");
        }
        fazerEletosfera(distribuirEletrons(eletrons), distribuirEletrons(eletrons).length, raioElemento[protons -1], carga);
    });
    $('#rmvE').click(function(){
        if(eletrons == 0 || eletrons == protons - 5){}else{eletrons--;}
        var carga = protons - eletrons;
        if(carga == 0){
            $('#simbolo span').html(elementos[protons - 1]);
        }else if(carga == 1){
            $('#simbolo span').html(elementos[protons - 1] + "<sup>+</sup>");
        }else if(carga == -1){
            $('#simbolo span').html(elementos[protons - 1] + "<sup>-</sup>");
        }else if(carga > 1){
            $('#simbolo span').html(elementos[protons - 1] + "<sup>+" + carga + "</sup>");
        }else{
            $('#simbolo span').html(elementos[protons - 1] + "<sup>" + carga + "</sup>");
        }
        fazerEletosfera(distribuirEletrons(eletrons), distribuirEletrons(eletrons).length, raioElemento[protons -1], carga);
    });

    $('table tr td').click(function(){
        if($(this).text() != "" && $(this).text() != "."){
            var numeroAtomico = elementos.indexOf($(this).html()) + 1;
            protons = numeroAtomico;
            neutrons = neutronsElemento[protons - 1];
            eletrons = numeroAtomico;
            $('#simbolo span').html(elementos[protons - 1]);
            fazerNucleo();
            fazerEletosfera(distribuirEletrons(eletrons), distribuirEletrons(eletrons).length, raioElemento[protons -1], 0);
        }
    });
/*--------------------------------THREE.JS--------------------------------*/

//Cena
const scene = new THREE.Scene();

//Itens

//Luz
const light = new THREE.AmbientLight(0xffffff, 1.5);

const pointLight = new THREE.PointLight(0xffffff, 10000);
pointLight.position.set(30, 30, 75);

scene.add(light);
scene.add(pointLight);

//Camera
const canvas = document.querySelector("canvas.threejs");
const aspectRatio = canvas.offsetWidth / canvas.offsetHeight;
const camera = new THREE.OrthographicCamera(-15 * aspectRatio, 15 * aspectRatio, 15, -15, -75, 30000);
camera.position.z = 10;

scene.add(camera);

const nucleo = new THREE.Group();

function fazerNucleo(){
    nucleo.clear();
    var particulasNucleo = neutrons + protons;
    var volumeTotal = particulasNucleo * ((4/3) * Math.PI * 0.3 * 0.3 * 0.3)
    var raioTotal = Math.cbrt(volumeTotal / ((4/3) * Math.PI));
    var quantidadeEsferas = (raioTotal * raioTotal)/(0.3 * 0.3);
    var proporcaoNeutron = neutrons * Math.round(quantidadeEsferas) / particulasNucleo;

    var incremento = (Math.PI) * (3 - Math.sqrt(5));
    var offset = 2 / protons;

    for (let i = 0; i < protons; i++) {
        const y = ((i * offset) - 1) + (offset / 2);
        const r = Math.sqrt(1 - y * y);
        const phi = i * incremento;

        const x = Math.cos(phi) * r;
        const z = Math.sin(phi) * r;

        const protonGeometry = new THREE.SphereGeometry(0.3, 30, 30);
        const protonMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.5
        });
        const protonMesh = new THREE.Mesh(
            protonGeometry,
            protonMaterial
        );

        protonMesh.position.set(x * -raioTotal, y * raioTotal, z * raioTotal);

        nucleo.add(protonMesh);
    }

    incremento = (Math.PI) * (3 - Math.sqrt(5));
    offset = 2 / neutrons;

    for (let i = 0; i < neutrons; i++) {
        const y = ((i * offset) - 1) + (offset / 2);
        const r = Math.sqrt(1 - y * y);
        const phi = i * incremento;

        const x = Math.cos(phi) * r;
        const z = Math.sin(phi) * r;

        const neutronGeometry = new THREE.SphereGeometry(0.3, 30, 30);
        const neutronMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            roughness: 0.5,
            metalness: 0.5
        });
        const neutronMesh = new THREE.Mesh(
            neutronGeometry,
            neutronMaterial
        );

        neutronMesh.position.set(x * raioTotal, y * raioTotal, z * raioTotal);

        nucleo.add(neutronMesh);
    }

    scene.add(nucleo);
}
fazerNucleo();

const eletrosfera = new THREE.Group();

function fazerEletosfera(camadas, qCamadas, raio, carga){
    eletrosfera.clear();
    
    var a = 1;
    while(a <= qCamadas){
        var qEletrons = camadas[qCamadas - a].eletrons;

        const raioAtomico = raio * ((8 - 0.5 * carga)/(a));
        const incremento = (Math.PI) * (3 - Math.sqrt(5));
        const offset = 2 / qEletrons;

        for (let i = 0; i < qEletrons; i++) {
            const y = ((i * offset) - 1) + (offset / 2);
            const r = Math.sqrt(1 - y * y);
            const phi = i * incremento;

            const x = Math.cos(phi) * r;
            const z = Math.sin(phi) * r;

            const eletronGeometry = new THREE.SphereGeometry(0.2, 30, 30);
            const eletronMaterial = new THREE.MeshStandardMaterial({
                color: 0xefefef,
                roughness: 0.5,
                metalness: 0.5
            });
            const eletronMesh = new THREE.Mesh(
                eletronGeometry,
                eletronMaterial
            );
            eletronMesh.position.set(x * raioAtomico/50, y * raioAtomico/50, z * raioAtomico/50);

            eletrosfera.add(eletronMesh);
        }
        a++;
    }

    scene.add(eletrosfera);
}
fazerEletosfera(distribuirEletrons(eletrons), distribuirEletrons(eletrons).length, raioElemento[protons -1], carga);


//Renderização

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxPixelRatio);

window.addEventListener('resize', () =>{
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);
});

//Controles
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Relógio
const clock = new THREE.Clock();

//Renderização contínua
const renderLoop = () => {
    eletrosfera.rotation.y += 0.02;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
}
renderLoop();
});