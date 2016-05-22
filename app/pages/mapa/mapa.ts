import {Page} from 'ionic-angular';
import {ConferenciaDados} from '../../providers/conferencia-dados';

@Page({
    templateUrl: 'build/pages/mapa/mapa.html'
})
export class MapaPagina {
    constructor(private conferenciaDados:ConferenciaDados) {
    }

    onPageLoaded() {
        this.conferenciaDados.pegaMapa().then(mapaDados => {
            let mapaElemento = document.getElementById('mapa');

            let mapa = new google.maps.Map(mapaElemento, {
                center: mapaDados.find(d => d.centro),
                mapTypeId: google.maps.MapTypeId.HYBRID,
                zoom: 15
            });

            mapaDados.forEach(marcadoresDados => {
                let infoWindow = new google.maps.InfoWindow({
                    content: `<h5>${marcadoresDados.nome}</h5>`
                });

                let marcador = new google.maps.Marker({
                    position: marcadoresDados,
                    map: mapa,
                    title: marcadoresDados.nome
                });

                marcador.addListener('click', () => {
                    infoWindow.open(mapa, marcador);
                });
            });

            google.maps.event.addListenerOnce(mapa, 'idle', () => {
                mapaElemento.classList.add('mostra-mapa');
            });

        });
    }
}
