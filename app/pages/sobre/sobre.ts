import {Page} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/sobre/sobre.html'
})
export class SobrePagina {
    dataConferencia = '2047-05-17';

    formataData(data) {
        let partes = data.split("-");
        return partes[2] + '/' + partes[1] + '/' + partes[0];
    }
}
