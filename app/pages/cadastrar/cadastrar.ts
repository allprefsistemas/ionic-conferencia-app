import {Page, NavController} from 'ionic-angular';
import {abasPagina} from '../abas/abas';
import {UsuarioDados} from '../../providers/usuario-dados';

@Page({
    templateUrl: 'build/pages/cadastrar/cadastrar.html'
})
export class CadastrarPagina {
    cadastrar:{usuario?:string, senha?:string} = {};
    enviado = false;

    constructor(private nav:NavController, private usuarioDados:UsuarioDados) {
    }

    enviarForm(form) {
        this.enviado = true;

        if (form.valid) {
            this.usuarioDados.cadastrar(this.cadastrar.usuario);
            this.nav.push(abasPagina);
        }
    }
}
