import {Page, NavParams} from 'ionic-angular';
import {agendaPagina} from '../agenda/agenda';
import {PalestrantesListaPagina} from '../palestrantes-lista/palestrantes-lista';
import {MapaPagina} from '../mapa/mapa';
import {SobrePagina} from '../sobre/sobre';

@Page({
    templateUrl: 'build/pages/abas/abas.html'
})
export class abasPagina {
    // define a página raiz de cada aba
    aba1Raiz:any = agendaPagina;
    aba2Raiz:any = PalestrantesListaPagina;
    aba3Raiz:any = MapaPagina;
    aba4Raiz:any = SobrePagina;
    meuIndiceSelecionado:number;

    constructor(navParams:NavParams) {
        this.meuIndiceSelecionado = navParams.data.abaIndice || 0;
    }
}
