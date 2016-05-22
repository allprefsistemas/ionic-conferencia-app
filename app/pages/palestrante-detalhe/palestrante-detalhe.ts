import {NavController, NavParams, Page} from 'ionic-angular';
import {SessaoDetalhePagina} from '../sessao-detalhe/sessao-detalhe';

@Page({
    templateUrl: 'build/pages/palestrante-detalhe/palestrante-detalhe.html'
})
export class PalestranteDetalhePagina {
    palestrante:any;

    constructor(private nav:NavController, private navParams:NavParams) {
        this.palestrante = this.navParams.data;
    }

    irSessaoDetalhe(sessao) {
        this.nav.push(SessaoDetalhePagina, sessao);
    }

    irRedeSocial(palestrante, rede) {
        if (rede === 'twitter') {
            window.open(`https://twitter.com/${palestrante.twitter}`);
        }
        if (rede === 'github') {
            window.open(`https://github.com/allprefsistemas`);
        }
        if (rede === 'google') {
            window.open(`https://plus.google.com/u/2/117621004625719316865/posts`);
        }
    }
}
