import {Page, NavParams, ViewController} from 'ionic-angular';
import {ConferenciaDados} from '../../providers/conferencia-dados';

@Page({
    templateUrl: 'build/pages/agenda-filtro/agenda-filtro.html'
})
export class AgendaFiltroPagina {
    assuntos:Array<{nome:string, estaSelecionado:boolean}> = [];

    constructor(private conferenciaDados:ConferenciaDados,
                private navParams:NavParams,
                private viewCtrl:ViewController) {
        // passa um array com os assuntos que devem ser escondidos.
        let nomeAssuntosExcluidos = this.navParams.data;

        this.conferenciaDados.pegaAssuntos().then((nomeAssunto:string[]) => {

            nomeAssunto.forEach(assuntoNome => {
                this.assuntos.push({
                    nome: assuntoNome,
                    estaSelecionado: (nomeAssuntosExcluidos.indexOf(assuntoNome) === -1)
                });
            });

        });
    }

    limpaFiltros() {
        // altera todos os botões para marcados.
        this.assuntos.forEach(assunto => {
            assunto.estaSelecionado = true;
        });
    }

    aplicaFiltros() {
        // passa um novo array com os assunto que devem ser escondidos.
        let nomeAssuntosExcluidos = this.assuntos.filter(c => !c.estaSelecionado).map(c => c.nome);
        this.fechar(nomeAssuntosExcluidos);
    }

    fechar(dado) {
        // utilizando o ViewController irá fechar e passar os dados.
        this.viewCtrl.dismiss(dado);
    }
}
