import {Page, NavController, ActionSheet} from 'ionic-angular';
import {ConferenciaDados} from '../../providers/conferencia-dados';
import {PalestranteDetalhePagina} from '../palestrante-detalhe/palestrante-detalhe';
import {SessaoDetalhePagina} from '../sessao-detalhe/sessao-detalhe';

@Page({
    templateUrl: 'build/pages/palestrantes-lista/palestrantes-lista.html'
})
export class PalestrantesListaPagina {
    actionSheet:ActionSheet;
    palestrantes = [];

    constructor(private nav:NavController, conferenciaDados:ConferenciaDados) {
        conferenciaDados.pegaPalestrantes().then(palestrantes => {
            this.palestrantes = palestrantes;
        });
    }

    irSessaoDetalhe(sessao) {
        this.nav.push(SessaoDetalhePagina, sessao);
    }

    irPalestranteDetalhe(palestrante:string) {
        this.nav.push(PalestranteDetalhePagina, palestrante);
    }

    irPalestranteTwitter(palestrante) {
        window.open(`https://twitter.com/${palestrante.twitter}`);
    }

    abrirPalestranteCompartilhar(palestrante) {
        let actionSheet = ActionSheet.create({
            title: 'Compartilhar ' + palestrante.nome,
            buttons: [
                {
                    text: 'Copiar Link',
                    handler: () => {
                        alert('Clicou em Copiar Link: https://twitter.com/' + palestrante.twitter);
                        if (window['cordova'] && window['cordova'].plugins.clipboard) {
                            window['cordova'].plugins.clipboard.copy('https://twitter.com/' + palestrante.twitter);
                        }
                    }
                },
                {
                    text: 'Compartilhar Com ...',
                    handler: () => {
                        alert('Clicou Compartilhar Com');
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancelar',
                    handler: () => {
                        alert('Clicou Cancelar');
                    }
                }
            ]
        });

        this.nav.present(actionSheet);
    }
}
