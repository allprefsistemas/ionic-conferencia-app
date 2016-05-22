import {Page, NavController, NavParams, Alert, ActionSheet} from 'ionic-angular';
import {UsuarioDados} from '../../providers/usuario-dados';
import {PalestranteDetalhePagina} from '../palestrante-detalhe/palestrante-detalhe';

@Page({
    templateUrl: 'build/pages/sessao-detalhe/sessao-detalhe.html'
})
export class SessaoDetalhePagina {
    actionSheet:ActionSheet;
    sessao:any;
    esconderFavorito = false;

    constructor(
        private nav:NavController,
        private navParams:NavParams,
        private usuario:UsuarioDados
    ) {
        this.sessao = navParams.data;
    }

    irPalestranteDetalhe(palestrante:string) {
        this.nav.push(PalestranteDetalhePagina, palestrante);
    }

    verFavorito(id) {
        if (this.usuario.temFavorito(id)) {
            return true;
        }
    }

    adicionaFavorito(id) {
        console.log(id);
        this.usuario.adicionaFavorito(id);
        // cria uma instância de alerta.
        let alerta = Alert.create({
            title: 'Adicionado aos Favoritos',
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.esconderFavorito = true;
                }
            }]
        });
        this.nav.present(alerta);
    }

    abrirCompartilhar(sessao) {
        let actionSheet = ActionSheet.create({
            title: 'Compartilhar ' + sessao.nome,
            buttons: [
                {
                    text: 'Compartilhar Com ...',
                    handler: () => {
                        alert('Clicou Compartilhar Com');
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancelar'
                }
            ]
        });

        this.nav.present(actionSheet);
    }

    formataData(data) {
        let partes = data.split("-");
        return partes[2] + '/' + partes[1];
    }
}
